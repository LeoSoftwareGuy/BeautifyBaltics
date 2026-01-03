using BeautifyBaltics.Core.API.Application.Users.Queries.UserProfile;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using Microsoft.AspNetCore.Mvc;
using Wolverine;
using BeautifyBaltics.Core.API.Application.Users.Queries.GetUser;

namespace BeautifyBaltics.Core.API.Controllers;

[Route("users")]
public class UsersController(IMessageBus bus) : ApiController
{
    /// <summary>
    /// Gets user
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns>Returns user</returns>
    [HttpGet(Name = "GetUser")]
    [ProducesResponseType(typeof(GetUserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetUserResponse>> Get(CancellationToken cancellationToken)
    {
        var response = await bus.InvokeAsync<GetUserResponse>(new GetUserRequest(UserId));
        return Ok(response);
    }
}
