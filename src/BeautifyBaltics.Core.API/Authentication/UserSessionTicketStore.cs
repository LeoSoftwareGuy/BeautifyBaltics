using System.Security.Cryptography;
using BeautifyBaltics.Domain.Documents.User;
using Marten;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Memory;

namespace BeautifyBaltics.Core.API.Authentication;

public class UserSessionTicketStore(IServiceScopeFactory serviceScopeFactory, IDataProtectionProvider dataProtectionProvider, IMemoryCache memoryCache) : ITicketStore
{
    private readonly IDataProtector _protector = dataProtectionProvider.CreateProtector("UserSessionTicketStore");
    private const double DefaultSessionTimeoutInDays = 30;
    private static readonly TimeSpan SessionCacheTtl = TimeSpan.FromSeconds(30);

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

        memoryCache.Remove(key);

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

        if (memoryCache.TryGetValue(key, out AuthenticationTicket? cached))
            return cached;

        try
        {
            using var scope = serviceScopeFactory.CreateScope();
            var documentSession = scope.ServiceProvider.GetRequiredService<IDocumentSession>();

            var session = await documentSession.LoadAsync<UserSession>(sessionId);
            if (session?.Ticket is null) return null;
            if (session.ExpirationTime < DateTime.UtcNow) return null;

            var ticket = TryDeserializeTicket(session.Ticket);
            if (ticket is not null)
                memoryCache.Set(key, ticket, SessionCacheTtl);

            return ticket;
        }
        catch (Marten.Exceptions.MartenCommandException ex)
            when (ex.InnerException is Npgsql.PostgresException { SqlState: "42P01" })
        {
            // Table doesn't exist yet (e.g. after a schema drop + restart race).
            // Treat as no session — forces re-authentication.
            return null;
        }
    }

    public async Task RemoveAsync(string key)
    {
        if (!Guid.TryParse(key, out var sessionId)) return;

        memoryCache.Remove(key);

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

    private AuthenticationTicket? TryDeserializeTicket(byte[] protectedTicket)
    {
        try
        {
            return TicketSerializer.Default.Deserialize(_protector.Unprotect(protectedTicket));
        }
        catch (CryptographicException)
        {
            // Key was rotated (e.g. after a restart before persistence was configured).
            // Returning null forces the cookie to be rejected and the user to re-authenticate.
            return null;
        }
    }
}
