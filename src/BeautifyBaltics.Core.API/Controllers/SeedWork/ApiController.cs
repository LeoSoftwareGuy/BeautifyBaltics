using Microsoft.AspNetCore.Mvc;
using Wolverine.Http;

namespace BeautifyBaltics.Core.API.Controllers.SeedWork;

[ApiController]
public abstract class ApiController : ControllerBase
{
    protected string TenantId
    {
        get => HttpContext.RequestServices.GetRequiredService<WolverineHttpOptions>().TryDetectTenantIdSynchronously(HttpContext)
               ?? throw new InvalidOperationException("Tenant ID not found in the current context");
    }
}

