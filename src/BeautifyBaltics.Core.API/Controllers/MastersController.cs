using BeautifyBaltics.Core.API.Application.Master.Commands.AddMasterJob;
using BeautifyBaltics.Core.API.Application.Master.Commands.CreateMaster;
using BeautifyBaltics.Core.API.Application.Master.Commands.DefineAvailability;
using BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterProfile;
using BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterJobImage;
using BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterProfileImage;
using BeautifyBaltics.Core.API.Application.Master.Queries.FindMasters;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterById;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterJobImage;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterProfileImage;
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
        var response = await bus.InvokeAsync<PagedResponse<FindMastersResponse>>(request);
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
        var response = await bus.InvokeAsync<GetMasterByIdResponse>(request with { Id = id });
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
        var response = await bus.InvokeAsync<CreateMasterResponse>(
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
        var response = await bus.InvokeAsync<UpdateMasterProfileResponse>(request with { MasterId = id }, cancellationToken);
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
        var response = await bus.InvokeAsync<CreateMasterJobResponse>(request with { MasterId = id }, cancellationToken);
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
        var response = await bus.InvokeAsync<CreateMasterAvailabilityResponse>(request with { MasterId = id }, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Upload master profile image
    /// </summary>
    [HttpPost("{id:guid}/profile-image", Name = "UploadMasterProfileImage")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(50 * 1024 * 1024)] // 50MB limit for total request
    [ProducesResponseType(typeof(UploadMasterProfileImageResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> UploadProfileImage([FromRoute] Guid id, [FromForm] UploadMasterProfileImageRequest request, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeAsync<UploadMasterProfileImageResponse>(request with { MasterId = id }, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Get master profile image
    /// </summary>
    [HttpGet("{id:guid}/profile-image", Name = "GetMasterProfileImage")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetProfileImage([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeAsync<GetMasterProfileImageResponse>(new GetMasterProfileImageRequest { MasterId = id }, cancellationToken);
        return File(response.Data, response.FileMimeType, response.FileName);
    }

    /// <summary>
    /// Upload an image for a master job
    /// </summary>
    [HttpPost("{masterId:guid}/jobs/{jobId:guid}/images", Name = "UploadMasterJobImage")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(50 * 1024 * 1024)]
    [ProducesResponseType(typeof(UploadMasterJobImageResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> UploadMasterJobImage([FromRoute] Guid masterId, [FromRoute] Guid jobId, [FromForm] UploadMasterJobImageRequest request, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeAsync<UploadMasterJobImageResponse>(request with { MasterId = masterId, MasterJobId = jobId }, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Download a master job image
    /// </summary>
    [HttpGet("{masterId:guid}/jobs/{jobId:guid}/images/{imageId:guid}", Name = "GetMasterJobImageById")]
    [ProducesResponseType(typeof(GetMasterJobImageByIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetMasterJobImageByIdResponse>> GetMasterJobImage([FromRoute] Guid masterId, [FromRoute] Guid jobId, [FromRoute] Guid imageId, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeAsync<GetMasterJobImageByIdResponse>(new GetMasterJobImageByIdRequest
        {
            MasterId = masterId,
            MasterJobId = jobId,
            MasterJobImageId = imageId
        }, cancellationToken);
        return Ok(response);
    }
}
