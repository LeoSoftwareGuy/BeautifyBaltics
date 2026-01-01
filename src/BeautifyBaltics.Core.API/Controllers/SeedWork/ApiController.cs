using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine.Http;

namespace BeautifyBaltics.Core.API.Controllers.SeedWork;

[ApiController]
[Authorize]
public abstract class ApiController : ControllerBase
{
    protected string TenantId
    {
        get => HttpContext.RequestServices.GetRequiredService<WolverineHttpOptions>().TryDetectTenantIdSynchronously(HttpContext)
               ?? throw new InvalidOperationException("Tenant ID not found in the current context");
    }

    protected string UserId => User.FindFirstValue(ClaimTypes.Email)
                                   ?? User.FindFirstValue("sub")
                                   ?? throw new InvalidOperationException("User ID not found in the current context");
}
