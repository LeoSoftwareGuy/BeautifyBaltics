using BeautifyBaltics.Core.API.Application.Master.Commands.AddMasterJob;
using BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterAvailability;
using BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterJob;
using BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterJobImage;
using BeautifyBaltics.Core.API.Application.Master.Commands.SetMasterJobFeaturedImage;
using BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterJob;
using BeautifyBaltics.Core.API.Application.Master.Commands.CreateMaster;
using BeautifyBaltics.Core.API.Application.Master.Commands.DefineAvailability;
using BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterProfile;
using BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterJobImage;
using BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterProfileImage;
using BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterAvailabilities;
using BeautifyBaltics.Core.API.Application.Master.Queries.FindMasters;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterAvailability;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterById;
using BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterJobs;
using BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterJobImages;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterJobImage;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterProfileImage;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetDashboardStats;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetEarningsPerformance;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetPendingRequests;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetAvailableTimeSlots;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using Microsoft.AspNetCore.Mvc;
using Wolverine;
using BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterAvailability;

namespace BeautifyBaltics.Core.API.Controllers;

[Route("masters")]
public class MastersController(IMessageBus bus) : ApiController
{
    /// <summary>
    /// Find masters
    /// </summary>
    /// <param name="request">Find masters request</param>
    /// <returns>Paged response of masters</returns>
    [HttpGet(Name = "FindMasters")]
    [ProducesResponseType(typeof(PagedResponse<FindMastersResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<PagedResponse<FindMastersResponse>>> Find([FromQuery] FindMastersRequest request)
    {
        var response = await bus.InvokeAsync<PagedResponse<FindMastersResponse>>(request);
        return Ok(response);
    }

    /// <summary>
    /// Get a master by id
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="request">Request paramters</param>
    /// <returns>Master of 404 if not found</returns>
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
    /// <param name="request">Create master request</param>
    /// <returns>Create master</returns>
    [HttpPost(Name = "CreateMaster")]
    [ProducesResponseType(typeof(CreateMasterResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> Create([FromBody] CreateMasterRequest request)
    {
        var response = await bus.InvokeAsync<CreateMasterResponse>(request with { SupabaseUserId = UserId });
        return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
    }

    /// <summary>
    /// Update master profile
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="request">Update master request</param>
    /// <returns>Updated master id</returns>
    [HttpPut("{id:guid}", Name = "UpdateMasterProfile")]
    [ProducesResponseType(typeof(UpdateMasterProfileResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> UpdateProfile([FromRoute] Guid id, [FromBody] UpdateMasterProfileRequest request)
    {
        var response = await bus.InvokeAsync<UpdateMasterProfileResponse>(request with { MasterId = id });
        return Ok(response);
    }

    /// <summary>
    /// Create a master job
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="request">Create master request</param>
    /// <returns>Master id and newly create master job id</returns>
    [HttpPost("{id:guid}/jobs", Name = "CreateMasterJob")]
    [ProducesResponseType(typeof(CreateMasterJobResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> CreateMasterJob([FromRoute] Guid id, [FromBody] CreateMasterJobRequest request)
    {
        var response = await bus.InvokeAsync<CreateMasterJobResponse>(request with { MasterId = id });
        return Ok(response);
    }

    /// <summary>
    /// Find master jobs
    /// </summary>
    /// <param name="id">Master id</param>
    /// <returns>Master jobs</returns>
    [HttpGet("{id:guid}/jobs", Name = "FindMasterJobs")]
    [ProducesResponseType(typeof(FindMasterJobsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<FindMasterJobsResponse>> FindMasterJobs([FromRoute] Guid id)
    {
        var response = await bus.InvokeAsync<FindMasterJobsResponse>(new FindMasterJobsRequest { MasterId = id });
        return Ok(response);
    }

    /// <summary>
    /// Find all images for a master's jobs
    /// </summary>
    /// <param name="id">Master id</param>
    /// <returns>All images with base64 data for the master's jobs</returns>
    [HttpGet("{id:guid}/images", Name = "FindMasterJobImages")]
    [ProducesResponseType(typeof(FindMasterJobImagesResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FindMasterJobImagesResponse>> FindMasterJobImages([FromRoute] Guid id)
    {
        var response = await bus.InvokeAsync<FindMasterJobImagesResponse>(new FindMasterJobImagesRequest { MasterId = id });
        return Ok(response);
    }

    /// <summary>
    /// Delete master job
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="jobId">Master job id</param>
    [HttpDelete("{id:guid}/jobs/{jobId:guid}", Name = "DeleteMasterJob")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> DeleteMasterJob([FromRoute] Guid id, [FromRoute] Guid jobId)
    {
        var response = await bus.InvokeAsync<DeleteMasterJobResponse>(new DeleteMasterJobRequest { MasterId = id, MasterJobId = jobId });
        return Ok(response);
    }

    /// <summary>
    /// Update master job
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="jobId">Master job id</param>
    /// <param name="request">Update master job request</param>
    /// <returns>Updated master id and master job id</returns>
    [HttpPut("{id:guid}/jobs/{jobId:guid}", Name = "UpdateMasterJob")]
    [ProducesResponseType(typeof(UpdateMasterJobResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UpdateMasterJob([FromRoute] Guid id, [FromRoute] Guid jobId, [FromBody] UpdateMasterJobRequest request)
    {
        var response = await bus.InvokeAsync<UpdateMasterJobResponse>(request with { MasterId = id, MasterJobId = jobId });
        return Ok(response);
    }

    /// <summary>
    /// Create master availability
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="request">Create master request</param>
    [HttpPost("{id:guid}/availability", Name = "CreateMasterAvailability")]
    [ProducesResponseType(typeof(CreateMasterAvailabilityResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> CreateMasterAvailability([FromRoute] Guid id, [FromBody] CreateMasterAvailabilityRequest request)
    {
        var response = await bus.InvokeAsync<CreateMasterAvailabilityResponse>(request with { MasterId = id });
        return Ok(response);
    }

    /// <summary>
    /// Update master availability
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="availabilityId">Availability id</param>
    /// <param name="request">Update master availability request</param>
    /// <returns>Updated master availability</returns>
    [HttpPut("{id:guid}/availability/{availabilityId:guid}", Name = "UpdateMasterAvailability")]
    [ProducesResponseType(typeof(UpdateMasterAvailabilityResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> UpdateMasterAvailability([FromRoute] Guid id, [FromRoute] Guid availabilityId, [FromBody] UpdateMasterAvailabilityRequest request)
    {
        var response = await bus.InvokeAsync<UpdateMasterAvailabilityResponse>(request with { MasterId = id, MasterAvailabilityId = availabilityId });
        return Ok(response);
    }

    /// <summary>
    /// Find master availabilities
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="request">Find masters availability request params</param>
    /// <returns>Paged master availabilities</returns>
    [HttpGet("{id:guid}/availability", Name = "FindMasterAvailabilities")]
    [ProducesResponseType(typeof(PagedResponse<FindMasterAvailabilitiesResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<PagedResponse<FindMasterAvailabilitiesResponse>>> FindMasterAvailabilities([FromRoute] Guid id, [FromQuery] FindMasterAvailabilitiesRequest request)
    {
        var response = await bus.InvokeAsync<PagedResponse<FindMasterAvailabilitiesResponse>>(request with { MasterId = id });
        return Ok(response);
    }

    /// <summary>
    /// Get master availability by id
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="availabilityId">Availability id</param>
    /// <returns>Master availability</returns>
    [HttpGet("{id:guid}/availability/{availabilityId:guid}", Name = "GetMasterAvailability")]
    [ProducesResponseType(typeof(GetMasterAvailabilityResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetMasterAvailabilityResponse>> GetMasterAvailability([FromRoute] Guid id, [FromRoute] Guid availabilityId)
    {
        var response = await bus.InvokeAsync<GetMasterAvailabilityResponse>(new GetMasterAvailabilityRequest { MasterId = id, MasterAvailabilityId = availabilityId });
        return Ok(response);
    }

    /// <summary>
    /// Get available time slots for booking
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="request">Request with date and service duration</param>
    /// <returns>List of available time slots</returns>
    [HttpGet("{id:guid}/available-slots", Name = "GetAvailableTimeSlots")]
    [ProducesResponseType(typeof(GetAvailableTimeSlotsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<GetAvailableTimeSlotsResponse>> GetAvailableTimeSlots([FromRoute] Guid id, [FromQuery] GetAvailableTimeSlotsRequest request)
    {
        var response = await bus.InvokeAsync<GetAvailableTimeSlotsResponse>(request with { MasterId = id });
        return Ok(response);
    }

    /// <summary>
    /// Delete master availability
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="availabilityId">Availability id</param>
    [HttpDelete("{id:guid}/availability/{availabilityId:guid}", Name = "DeleteMasterAvailability")]
    [ProducesResponseType(typeof(DeleteMasterAvailabilityResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> DeleteMasterAvailability([FromRoute] Guid id, [FromRoute] Guid availabilityId)
    {
        var response = await bus.InvokeAsync<DeleteMasterAvailabilityResponse>(new DeleteMasterAvailabilityRequest { MasterId = id, MasterAvailabilityId = availabilityId });
        return Ok(response);
    }

    /// <summary>
    /// Upload master profile image
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="request">Master profile image request</param>
    /// <returns>Updater master id</returns>
    [HttpPost("{id:guid}/profile-image", Name = "UploadMasterProfileImage")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(50 * 1024 * 1024)] // 50MB limit for total request
    [ProducesResponseType(typeof(UploadMasterProfileImageResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> UploadProfileImage([FromRoute] Guid id, [FromForm] UploadMasterProfileImageRequest request)
    {
        var response = await bus.InvokeAsync<UploadMasterProfileImageResponse>(request with { MasterId = id });
        return Ok(response);
    }

    /// <summary>
    /// Get master profile image
    /// </summary>
    /// <param name="id">Master id</param>
    /// <returns>Master profile image</returns>
    [HttpGet("{id:guid}/profile-image", Name = "GetMasterProfileImage")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetProfileImage([FromRoute] Guid id)
    {
        var response = await bus.InvokeAsync<GetMasterProfileImageResponse>(new GetMasterProfileImageRequest { MasterId = id });
        return File(response.Data, response.FileMimeType, response.FileName);
    }

    /// <summary>
    /// Upload an image for a master job
    /// </summary>
    /// <param name="masterId">Master id</param>
    /// <param name="jobId">Master Job id</param>
    /// <param name="request">Upload master job request</param>
    /// <returns>Master id and master job id</returns>
    [HttpPost("{masterId:guid}/jobs/{jobId:guid}/images", Name = "UploadMasterJobImage")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(50 * 1024 * 1024)]
    [ProducesResponseType(typeof(UploadMasterJobImageResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> UploadMasterJobImage([FromRoute] Guid masterId, [FromRoute] Guid jobId, [FromForm] UploadMasterJobImageRequest request)
    {
        var response = await bus.InvokeAsync<UploadMasterJobImageResponse>(request with { MasterId = masterId, MasterJobId = jobId });
        return Ok(response);
    }

    /// <summary>
    /// Get master job image
    /// </summary>
    /// <param name="masterId">Master id</param>
    /// <param name="jobId">Job id</param>
    /// <param name="imageId">Image id</param>
    /// <returns>Master job image as JSON with base64 encoded data</returns>
    [HttpGet("{masterId:guid}/jobs/{jobId:guid}/images/{imageId:guid}", Name = "GetMasterJobImageById")]
    [ProducesResponseType(typeof(GetMasterJobImageByIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetMasterJobImageByIdResponse>> GetMasterJobImage([FromRoute] Guid masterId, [FromRoute] Guid jobId, [FromRoute] Guid imageId)
    {
        var response = await bus.InvokeAsync<GetMasterJobImageByIdResponse>(new GetMasterJobImageByIdRequest
        {
            MasterId = masterId,
            MasterJobId = jobId,
            MasterJobImageId = imageId
        });
        return Ok(response);
    }

    /// <summary>
    /// Delete master job image
    /// </summary>
    /// <param name="masterId">Master id</param>
    /// <param name="jobId">Job id</param>
    /// <param name="imageId">Image id</param>
    [HttpDelete("{masterId:guid}/jobs/{jobId:guid}/images/{imageId:guid}", Name = "DeleteMasterJobImage")]
    [ProducesResponseType(typeof(DeleteMasterJobImageResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> DeleteMasterJobImage([FromRoute] Guid masterId, [FromRoute] Guid jobId, [FromRoute] Guid imageId)
    {
        var response = await bus.InvokeAsync<DeleteMasterJobImageResponse>(new DeleteMasterJobImageRequest
        {
            MasterId = masterId,
            MasterJobId = jobId,
            MasterJobImageId = imageId
        });
        return Ok(response);
    }

    /// <summary>
    /// Set or unset the featured image for a master job
    /// </summary>
    /// <param name="masterId"></param>
    /// <param name="jobId"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut("{masterId:guid}/jobs/{jobId:guid}/featured-image", Name = "SetMasterJobFeaturedImage")]
    [ProducesResponseType(typeof(SetMasterJobFeaturedImageResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> SetMasterJobFeaturedImage([FromRoute] Guid masterId, [FromRoute] Guid jobId, [FromBody] SetMasterJobFeaturedImageBody request)
    {
        var response = await bus.InvokeAsync<SetMasterJobFeaturedImageResponse>(new SetMasterJobFeaturedImageRequest
        {
            MasterId = masterId,
            MasterJobId = jobId,
            MasterJobImageId = request.ImageId
        });
        return Ok(response);
    }

    /// <summary>
    /// Get dashboard stats for a master
    /// </summary>
    /// <param name="id">Master id</param>
    /// <returns>Dashboard statistics including total bookings, earnings, and pending requests</returns>
    [HttpGet("{id:guid}/dashboard/stats", Name = "GetDashboardStats")]
    [ProducesResponseType(typeof(GetDashboardStatsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetDashboardStatsResponse>> GetDashboardStats([FromRoute] Guid id)
    {
        var response = await bus.InvokeAsync<GetDashboardStatsResponse>(new GetDashboardStatsRequest { MasterId = id });
        return Ok(response);
    }

    /// <summary>
    /// Get earnings performance data for a master
    /// </summary>
    /// <param name="id">Master id</param>
    /// <param name="request">Request with period filter (Weekly, Monthly, Yearly)</param>
    /// <returns>Earnings data grouped by the selected period</returns>
    [HttpGet("{id:guid}/dashboard/earnings", Name = "GetEarningsPerformance")]
    [ProducesResponseType(typeof(GetEarningsPerformanceResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetEarningsPerformanceResponse>> GetEarningsPerformance([FromRoute] Guid id, [FromQuery] GetEarningsPerformanceRequest request)
    {
        var response = await bus.InvokeAsync<GetEarningsPerformanceResponse>(request with { MasterId = id });
        return Ok(response);
    }

    /// <summary>
    /// Get pending booking requests for a master
    /// </summary>
    /// <param name="id">Master id</param>
    /// <returns>List of pending booking requests</returns>
    [HttpGet("{id:guid}/dashboard/pending-requests", Name = "GetPendingRequests")]
    [ProducesResponseType(typeof(GetPendingRequestsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetPendingRequestsResponse>> GetPendingRequests([FromRoute] Guid id)
    {
        var response = await bus.InvokeAsync<GetPendingRequestsResponse>(new GetPendingRequestsRequest { MasterId = id });
        return Ok(response);
    }
}
