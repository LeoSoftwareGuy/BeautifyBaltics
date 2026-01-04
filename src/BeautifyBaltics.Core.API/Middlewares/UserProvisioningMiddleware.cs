using BeautifyBaltics.Core.API.Application.Auth.Services;

namespace BeautifyBaltics.Core.API.Middlewares;

public class UserProvisioningMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, IUserProvisioningService provisioningService)
    {
        if (context.User?.Identity?.IsAuthenticated == true)
        {
            await provisioningService.EnsureProvisionedAsync(context.User, context.RequestAborted);
        }

        await next(context);
    }
}
