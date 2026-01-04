using System.Collections.Concurrent;
using System.Security.Claims;

using BeautifyBaltics.Core.API.Application.Client.Commands.CreateClient;
using BeautifyBaltics.Core.API.Application.Master.Commands.CreateMaster;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.Client;
using BeautifyBaltics.Persistence.Repositories.Master;
using Marten.Exceptions;
using Wolverine;

namespace BeautifyBaltics.Core.API.Application.Auth.Services;

public sealed class UserProvisioningService(
    IClientRepository clientRepository,
    IMasterRepository masterRepository,
    IMessageBus bus,
    ILogger<UserProvisioningService> logger
) : IUserProvisioningService
{
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> Locks = new();

    public async Task EnsureProvisionedAsync(ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        if (user.Identity?.IsAuthenticated != true) return;

        var context = SupabaseUserContext.FromClaims(user, logger);
        if (context is null) return;

        if (await ProfileExists(context.SupabaseUserId, cancellationToken)) return;

        var semaphore = Locks.GetOrAdd(context.SupabaseUserId, static _ => new SemaphoreSlim(1, 1));
        await semaphore.WaitAsync(cancellationToken);

        try
        {
            await EnsureProfileInternalAsync(context, cancellationToken);
        }
        finally
        {
            semaphore.Release();
            if (semaphore.CurrentCount == 1)
            {
                Locks.TryRemove(context.SupabaseUserId, out _);
            }
        }
    }

    private async Task<bool> ProfileExists(string supabaseUserId, CancellationToken cancellationToken)
    {
        var client = await clientRepository.GetBySupabaseUserIdAsync(supabaseUserId, cancellationToken);
        if (client is not null) return true;

        var master = await masterRepository.GetBySupabaseUserIdAsync(supabaseUserId, cancellationToken);
        return master is not null;
    }

    private async Task EnsureProfileInternalAsync(SupabaseUserContext context, CancellationToken cancellationToken)
    {
        try
        {
            if (context.Role == UserRole.Master)
            {
                await bus.InvokeAsync<CreateMasterResponse>(new CreateMasterRequest
                {
                    SupabaseUserId = context.SupabaseUserId,
                    FirstName = context.FirstName,
                    LastName = context.LastName,
                    Email = context.Email,
                    PhoneNumber = context.PhoneNumber,
                }, cancellationToken);
                return;
            }

            await bus.InvokeAsync<CreateClientResponse>(new CreateClientRequest
            {
                SupabaseUserId = context.SupabaseUserId,
                FirstName = context.FirstName,
                LastName = context.LastName,
                Email = context.Email,
                PhoneNumber = context.PhoneNumber,
            }, cancellationToken);
        }
        catch (DocumentAlreadyExistsException)
        {
            logger.LogInformation(
                "Profile for Supabase user {SupabaseUserId} has already been provisioned. Skipping.",
                context.SupabaseUserId);
        }
    }
}
