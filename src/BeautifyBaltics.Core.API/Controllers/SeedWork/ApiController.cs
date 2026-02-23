using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeautifyBaltics.Core.API.Controllers.SeedWork;

[ApiController]
[Authorize]
public abstract class ApiController : ControllerBase
{
    protected Guid UserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new InvalidOperationException("User ID not found in the current context"));
}
