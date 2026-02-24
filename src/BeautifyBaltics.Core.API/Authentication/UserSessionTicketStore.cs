using BeautifyBaltics.Domain.Documents.User;
using Marten;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;

namespace BeautifyBaltics.Core.API.Authentication;

public class UserSessionTicketStore(IServiceScopeFactory serviceScopeFactory, IDataProtectionProvider dataProtectionProvider) : ITicketStore
{
    private readonly IDataProtector _protector = dataProtectionProvider.CreateProtector("UserSessionTicketStore");
    private const double DefaultSessionTimeoutInDays = 30;

    public async Task<string> StoreAsync(AuthenticationTicket ticket)
    {
        if (!Guid.TryParse(ticket.Principal.FindFirst(CustomClaimTypes.SessionId)?.Value, out var sessionId))
        {
            throw new InvalidOperationException("Unable to retrieve the session ID from the ticket.");
        }
            
        if (!Guid.TryParse(ticket.Principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var userId))
        {
            throw new InvalidOperationException("Unable to retrieve the user ID from the ticket.");
        }  

        using var scope = serviceScopeFactory.CreateScope();
        var documentSession = scope.ServiceProvider.GetRequiredService<IDocumentSession>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();

        var serializedTicket = SerializeTicket(ticket);
        var expirationTime = GetExpirationTime(ticket);

        var session = new UserSession(
            id: sessionId,
            userId: userId,
            ticket: serializedTicket,
            expirationTime: expirationTime,
            ipAddress: httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
            userAgent: httpContextAccessor.HttpContext?.Request.Headers.UserAgent.ToString()
        );

        documentSession.Insert(session);
        await documentSession.SaveChangesAsync();

        return sessionId.ToString();
    }

    public async Task RenewAsync(string key, AuthenticationTicket ticket)
    {
        if (!Guid.TryParse(key, out var sessionId)) throw new InvalidOperationException("Invalid session key.");

        using var scope = serviceScopeFactory.CreateScope();
        var documentSession = scope.ServiceProvider.GetRequiredService<IDocumentSession>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();

        var session = await documentSession.LoadAsync<UserSession>(sessionId)
            ?? throw new InvalidOperationException($"Session {key} not found.");

        session.Extend(
            ticket: SerializeTicket(ticket),
            expirationTime: GetExpirationTime(ticket),
            ipAddress: httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
            userAgent: httpContextAccessor.HttpContext?.Request.Headers.UserAgent.ToString()
        );

        documentSession.Update(session);
        await documentSession.SaveChangesAsync();
    }

    public async Task<AuthenticationTicket?> RetrieveAsync(string key)
    {
        if (!Guid.TryParse(key, out var sessionId)) return null;

        using var scope = serviceScopeFactory.CreateScope();
        var documentSession = scope.ServiceProvider.GetRequiredService<IDocumentSession>();

        var session = await documentSession.LoadAsync<UserSession>(sessionId);
        if (session?.Ticket is null) return null;
        if (session.ExpirationTime < DateTime.UtcNow) return null;

        return DeserializeTicket(session.Ticket);
    }

    public async Task RemoveAsync(string key)
    {
        if (!Guid.TryParse(key, out var sessionId)) return;

        using var scope = serviceScopeFactory.CreateScope();
        var documentSession = scope.ServiceProvider.GetRequiredService<IDocumentSession>();

        var session = await documentSession.LoadAsync<UserSession>(sessionId);
        if (session is null) return;

        documentSession.HardDelete(session);
        await documentSession.SaveChangesAsync();
    }

    private static DateTime GetExpirationTime(AuthenticationTicket ticket) =>
        ticket.Properties.ExpiresUtc?.UtcDateTime
        ?? DateTime.UtcNow.AddDays(DefaultSessionTimeoutInDays);

    private byte[] SerializeTicket(AuthenticationTicket ticket) => _protector.Protect(TicketSerializer.Default.Serialize(ticket));

    private AuthenticationTicket DeserializeTicket(byte[] protectedTicket) =>
        TicketSerializer.Default.Deserialize(_protector.Unprotect(protectedTicket))
        ?? throw new InvalidOperationException("Unable to deserialize the authentication ticket.");
}
