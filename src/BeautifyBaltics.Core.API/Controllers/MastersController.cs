using BeautifyBaltics.Core.API.Application.Master.Commands.AddMasterJob;
using BeautifyBaltics.Core.API.Application.Master.Commands.CreateMaster;
using BeautifyBaltics.Core.API.Application.Master.Commands.DefineAvailability;
using BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterProfile;
using BeautifyBaltics.Core.API.Application.Master.Queries.FindMasters;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterById;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[Route("masters")]
public class MastersController(IMessageBus bus) : ApiController
{
    /// <summary>
    /// Find masters
    /// </summary>
    [HttpGet(Name = "FindMasters")]
    [ProducesResponseType(typeof(PagedResponse<FindMastersResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<PagedResponse<FindMastersResponse>>> Find([FromQuery] FindMastersRequest request)
    {
        var response = await bus.InvokeForTenantAsync<PagedResponse<FindMastersResponse>>(TenantId, request);
        return Ok(response);
    }

    /// <summary>
    /// Get master by id
    /// </summary>
    [HttpGet("{id:guid}", Name = "GetMasterById")]
    [ProducesResponseType(typeof(GetMasterByIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetMasterByIdResponse>> Get([FromRoute] Guid id, [FromQuery] GetMasterByIdRequest request)
    {
        var response = await bus.InvokeForTenantAsync<GetMasterByIdResponse>(TenantId, request with { Id = id });
        return Ok(response);
    }

    /// <summary>
    /// Create master
    /// </summary>
    [HttpPost(Name = "CreateMaster")]
    [ProducesResponseType(typeof(CreateMasterResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> Create([FromBody] CreateMasterRequest request, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeForTenantAsync<CreateMasterResponse>(
            TenantId,
            request with { SupabaseUserId = UserId },
            cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
    }

    /// <summary>
    /// Update master profile
    /// </summary>
    [HttpPut("{id:guid}", Name = "UpdateMasterProfile")]
    [ProducesResponseType(typeof(UpdateMasterProfileResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UpdateProfile([FromRoute] Guid id, [FromBody] UpdateMasterProfileRequest request, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeForTenantAsync<UpdateMasterProfileResponse>(TenantId, request with { MasterId = id }, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Add job to a master
    /// </summary>
    [HttpPost("{id:guid}/jobs", Name = "CreateMasterJob")]
    [ProducesResponseType(typeof(CreateMasterJobResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> CreateMasterJob([FromRoute] Guid id, [FromBody] CreateMasterJobRequest request, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeForTenantAsync<CreateMasterJobResponse>(TenantId, request with { MasterId = id }, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Define master availability slots
    /// </summary>
    [HttpPost("{id:guid}/availability", Name = "CreateMasterAvailability")]
    [ProducesResponseType(typeof(CreateMasterAvailabilityResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> CreateMasterAvailability([FromRoute] Guid id, [FromBody] CreateMasterAvailabilityRequest request, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeForTenantAsync<CreateMasterAvailabilityResponse>(TenantId, request with { MasterId = id }, cancellationToken);
        return Ok(response);
    }
}
