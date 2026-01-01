using BeautifyBaltics.Core.API.Application.Booking.Queries.FindBookings;
using BeautifyBaltics.Core.API.Application.Client.Commands.CreateClient;
using BeautifyBaltics.Core.API.Application.Client.Commands.UpdateClientProfile;
using BeautifyBaltics.Core.API.Application.Client.Queries.FindClients;
using BeautifyBaltics.Core.API.Application.Client.Queries.GetClientById;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[Route("clients")]
public class ClientsController(IMessageBus bus) : ApiController
{
    /// <summary>
    /// Find clients
    /// </summary>
    /// <param name="request">Find clients request</param>
    /// <returns>Paged response of clients</returns>
    [HttpGet(Name = "FindClients")]
    [ProducesResponseType(typeof(PagedResponse<FindClientsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<PagedResponse<FindBookingsResponse>>> Find([FromQuery] FindBookingsRequest request)
    {
        var response = await bus.InvokeAsync<PagedResponse<FindBookingsResponse>>(request);
        return Ok(response);
    }

    /// <summary>
    /// Get client by id
    /// </summary>
    /// <param name="id">Client id</param>
    /// <param name="request">Request parameters</param>
    /// <returns>Client or not found</returns>
    [HttpGet("{id:guid}", Name = "GetClientById")]
    [ProducesResponseType(typeof(GetClientByIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetClientByIdResponse>> Get([FromRoute] Guid id, [FromQuery] GetClientByIdRequest request)
    {
        var response = await bus.InvokeAsync<GetClientByIdResponse>(request with { Id = id });
        return Ok(response);
    }

    /// <summary>
    /// Create client
    /// </summary>
    /// <param name="request">Create client request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    [HttpPost(Name = "CreateClient")]
    [ProducesResponseType(typeof(CreateClientResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<CreatedAtActionResult> Create([FromBody] CreateClientRequest request, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeAsync<CreateClientResponse>(
            request with { SupabaseUserId = UserId },
            cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
    }

    /// <summary>
    /// Update client
    /// </summary>
    /// <param name="id">Client id</param>
    /// <param name="request">Update client request</param>
    /// <returns>Updated client id</returns>
    [HttpPut("{id:guid}", Name = "UpdateClientProfile")]
    [ProducesResponseType(typeof(UpdateClientProfileResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> Update([FromRoute] Guid id, UpdateClientProfileRequest request)
    {
        var response = await bus.InvokeAsync<UpdateClientProfileResponse>(request with { ClientID = id });
        return Ok(response);
    }
}
