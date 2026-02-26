using BeautifyBaltics.Core.API.Application.Admin.Commands.CreateJobCategory;
using BeautifyBaltics.Core.API.Application.Admin.Queries.GetClientStatistics;
using BeautifyBaltics.Core.API.Application.Admin.Queries.GetMasterStatistics;
using BeautifyBaltics.Core.API.Application.Job.Commands.CreateJob;
using BeautifyBaltics.Core.API.Application.Job.Commands.UpdateJob;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using BeautifyBaltics.Domain.Enumerations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[Authorize(Roles = nameof(UserRole.Admin))]
[Route("admin")]
public class AdminController(IMessageBus bus) : ApiController
{
    [HttpPost("job-categories", Name = "AdminCreateJobCategory")]
    [ProducesResponseType(typeof(CreateJobCategoryResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<CreateJobCategoryResponse>> CreateJobCategory([FromBody] CreateJobCategoryRequest request)
    {
        var response = await bus.InvokeAsync<CreateJobCategoryResponse>(request);
        return Created(string.Empty, response);
    }

    [HttpPost("jobs", Name = "AdminCreateJob")]
    [ProducesResponseType(typeof(CreateJobResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<CreateJobResponse>> CreateJob([FromBody] CreateJobRequest request)
    {
        var response = await bus.InvokeAsync<CreateJobResponse>(request);
        return CreatedAtRoute("GetJobById", new { id = response.Id }, response);
    }

    [HttpPut("jobs/{id:guid}", Name = "AdminUpdateJob")]
    [ProducesResponseType(typeof(UpdateJobResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<UpdateJobResponse>> UpdateJob([FromRoute] Guid id, [FromBody] UpdateJobRequest request)
    {
        var response = await bus.InvokeAsync<UpdateJobResponse>(request with { JobId = id });
        return Ok(response);
    }

    [HttpGet("stats/masters", Name = "GetMasterStatistics")]
    [ProducesResponseType(typeof(GetMasterStatisticsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetMasterStatisticsResponse>> GetMasterStatistics()
    {
        var response = await bus.InvokeAsync<GetMasterStatisticsResponse>(new GetMasterStatisticsRequest());
        return Ok(response);
    }

    [HttpGet("stats/clients", Name = "GetClientStatistics")]
    [ProducesResponseType(typeof(GetClientStatisticsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetClientStatisticsResponse>> GetClientStatistics()
    {
        var response = await bus.InvokeAsync<GetClientStatisticsResponse>(new GetClientStatisticsRequest());
        return Ok(response);
    }
}
