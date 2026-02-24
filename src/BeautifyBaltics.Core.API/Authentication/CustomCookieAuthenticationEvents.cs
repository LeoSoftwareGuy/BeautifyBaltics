using BeautifyBaltics.Domain.Documents.User;
using Marten;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace BeautifyBaltics.Core.API.Authentication;

public class CustomCookieAuthenticationEvents(IDocumentSession documentSession) : CookieAuthenticationEvents
{
    public override async Task<Task> ValidatePrincipal(CookieValidatePrincipalContext context)
    {
        if (context.Principal is null)
        {
            context.RejectPrincipal();
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }

        var sessionIdClaim = context.Principal.FindFirst(CustomClaimTypes.SessionId)?.Value;
        if (!Guid.TryParse(sessionIdClaim, out var sessionId))
        {
            context.RejectPrincipal();
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }

        var session = await documentSession.LoadAsync<UserSession>(sessionId);
        if (session is null || session.ExpirationTime < DateTime.UtcNow)
        {
            context.RejectPrincipal();
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }

        return base.ValidatePrincipal(context);
    }

    public override Task RedirectToLogin(RedirectContext<CookieAuthenticationOptions> context)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    }

    public override Task RedirectToAccessDenied(RedirectContext<CookieAuthenticationOptions> context)
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    }
}
