using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeautifyBaltics.Core.API.Controllers.SeedWork;

[ApiController]
[Authorize]
public abstract class ApiController : ControllerBase
{
    protected string UserId => User.FindFirstValue(ClaimTypes.Email)
                                   ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                                   ?? User.FindFirstValue("sub")
                                   ?? throw new InvalidOperationException("User ID not found in the current context");
}
