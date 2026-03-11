using BeautifyBaltics.Core.API.Application.Admin.Commands.CreateJobCategory;
using BeautifyBaltics.Core.API.Application.Admin.Queries.GetAdminUserDetail;
using BeautifyBaltics.Core.API.Application.Admin.Queries.GetDashboardSummary;
using BeautifyBaltics.Core.API.Application.Admin.Commands.DeleteJobCategory;
using BeautifyBaltics.Core.API.Application.Admin.Commands.DeleteUser;
using BeautifyBaltics.Core.API.Application.Admin.Commands.SetUserRole;
using BeautifyBaltics.Core.API.Application.Admin.Commands.UpdateJobCategory;
using BeautifyBaltics.Core.API.Application.Admin.Queries.FindUsers;
using BeautifyBaltics.Core.API.Application.Admin.Queries.GetBookingStatistics;
using BeautifyBaltics.Core.API.Application.Admin.Queries.GetClientStatistics;
using BeautifyBaltics.Core.API.Application.Admin.Queries.GetMasterStatistics;
using BeautifyBaltics.Core.API.Application.Admin.Queries.GetServiceStatistics;
using BeautifyBaltics.Core.API.Application.Admin.Queries.GetUserStatistics;
using BeautifyBaltics.Core.API.Application.SeedWork;
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

    [HttpPut("job-categories/{id:guid}", Name = "AdminUpdateJobCategory")]
    [ProducesResponseType(typeof(UpdateJobCategoryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<UpdateJobCategoryResponse>> UpdateJobCategory([FromRoute] Guid id, [FromBody] UpdateJobCategoryRequest request)
    {
        var response = await bus.InvokeAsync<UpdateJobCategoryResponse>(request with { Id = id });
        return Ok(response);
    }

    [HttpDelete("job-categories/{id:guid}", Name = "AdminDeleteJobCategory")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteJobCategory([FromRoute] Guid id)
    {
        await bus.InvokeAsync(new DeleteJobCategoryRequest(id));
        return NoContent();
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

    [HttpGet("dashboard", Name = "GetDashboardSummary")]
    [ProducesResponseType(typeof(GetDashboardSummaryResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetDashboardSummaryResponse>> GetDashboardSummary()
    {
        var response = await bus.InvokeAsync<GetDashboardSummaryResponse>(new GetDashboardSummaryRequest());
        return Ok(response);
    }

    [HttpGet("stats/services", Name = "GetServiceStatistics")]
    [ProducesResponseType(typeof(GetServiceStatisticsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetServiceStatisticsResponse>> GetServiceStatistics()
    {
        var response = await bus.InvokeAsync<GetServiceStatisticsResponse>(new GetServiceStatisticsRequest());
        return Ok(response);
    }

    [HttpGet("stats/bookings", Name = "GetBookingStatistics")]
    [ProducesResponseType(typeof(GetBookingStatisticsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetBookingStatisticsResponse>> GetBookingStatistics()
    {
        var response = await bus.InvokeAsync<GetBookingStatisticsResponse>(new GetBookingStatisticsRequest());
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

    [HttpGet("stats/users", Name = "GetUserStatistics")]
    [ProducesResponseType(typeof(GetUserStatisticsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetUserStatisticsResponse>> GetUserStatistics()
    {
        var response = await bus.InvokeAsync<GetUserStatisticsResponse>(new GetUserStatisticsRequest());
        return Ok(response);
    }

    [HttpGet("users/{id:guid}/detail", Name = "GetAdminUserDetail")]
    [ProducesResponseType(typeof(GetAdminUserDetailResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetAdminUserDetailResponse>> GetAdminUserDetail([FromRoute] Guid id)
    {
        var response = await bus.InvokeAsync<GetAdminUserDetailResponse>(new GetAdminUserDetailRequest(id));
        return Ok(response);
    }

    [HttpGet("users", Name = "FindUsers")]
    [ProducesResponseType(typeof(PagedResponse<FindUsersResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<FindUsersResponse>>> FindUsers([FromQuery] FindUsersRequest request)
    {
        var response = await bus.InvokeAsync<PagedResponse<FindUsersResponse>>(request);
        return Ok(response);
    }

    [HttpPut("users/{id:guid}/role", Name = "SetUserRole")]
    [ProducesResponseType(typeof(SetUserRoleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<SetUserRoleResponse>> SetUserRole([FromRoute] Guid id, [FromBody] SetUserRoleRequest request)
    {
        var response = await bus.InvokeAsync<SetUserRoleResponse>(request with { UserId = id });
        return Ok(response);
    }

    [HttpDelete("users/{id:guid}", Name = "DeleteUser")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid id)
    {
        await bus.InvokeAsync(new DeleteUserRequest(id));
        return NoContent();
    }
}
