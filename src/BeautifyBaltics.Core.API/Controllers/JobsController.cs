using BeautifyBaltics.Core.API.Application.Job.Commands.CreateJob;
using BeautifyBaltics.Core.API.Application.Job.Commands.UpdateJob;
using BeautifyBaltics.Core.API.Application.Job.Queries.FindJobs;
using BeautifyBaltics.Core.API.Application.Job.Queries.GetJobById;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[Route("jobs")]
public class JobsController(IMessageBus bus) : ApiController
{
    /// <summary>
    /// Find jobs
    /// </summary>
    /// <param name="request">Find jobs request</param>
    /// <returns>Paged response of jobs</returns>
    [HttpGet(Name = "FindJobs")]
    [ProducesResponseType(typeof(PagedResponse<FindJobsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<PagedResponse<FindJobsResponse>>> Find([FromQuery] FindJobsRequest request)
    {
        var response = await bus.InvokeForTenantAsync<PagedResponse<FindJobsResponse>>(TenantId, request);
        return Ok(response);
    }

    /// <summary>
    /// Get job by id
    /// </summary>
    /// <param name="id">Job id</param>
    /// <param name="request">Request parameters</param>
    /// <returns>Job or not found</returns>
    [HttpGet("{id:guid}", Name = "GetJobById")]
    [ProducesResponseType(typeof(GetJobByIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetJobByIdResponse>> Get([FromRoute] Guid id, [FromQuery] GetJobByIdRequest request)
    {
        var response = await bus.InvokeForTenantAsync<GetJobByIdResponse>(TenantId, request with { Id = id });
        return Ok(response);
    }

    /// <summary>
    /// Create a job
    /// </summary>
    /// <param name="request">Create job request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    [HttpPost(Name = "CreateJob")]
    [ProducesResponseType(typeof(CreateJobResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<CreatedAtActionResult> Create([FromBody] CreateJobRequest request, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeForTenantAsync<CreateJobResponse>(TenantId, request, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
    }

    /// <summary>
    /// Update job
    /// </summary>
    /// <param name="id">Job id</param>
    /// <param name="request">Update job request</param>
    /// <returns>Updated job id</returns>
    [HttpPut("{id:guid}", Name = "UpdateJob")]
    [ProducesResponseType(typeof(UpdateJobResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> Update([FromRoute] Guid id, UpdateJobRequest request)
    {
        var response = await bus.InvokeForTenantAsync<UpdateJobResponse>(TenantId, request with { JobId = id });
        return Ok(response);
    }
}
