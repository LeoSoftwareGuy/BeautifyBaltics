using BeautifyBaltics.Core.API.Application.Master.Commands.ApproveMasterKyc;
using BeautifyBaltics.Core.API.Application.Master.Commands.RejectMasterKyc;
using BeautifyBaltics.Core.API.Application.Master.Queries.GetPendingKycSubmissions;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using BeautifyBaltics.Domain.Enumerations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[Authorize(Roles = nameof(UserRole.Admin))]
[Route("admin/kyc")]
public class AdminKycController(IMessageBus bus) : ApiController
{
    /// <summary>
    /// Get all pending KYC submissions awaiting admin review
    /// </summary>
    [HttpGet(Name = "GetPendingKycSubmissions")]
    [ProducesResponseType(typeof(GetPendingKycSubmissionsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetPendingKycSubmissionsResponse>> GetPending()
    {
        var response = await bus.InvokeAsync<GetPendingKycSubmissionsResponse>(new GetPendingKycSubmissionsRequest());
        return Ok(response);
    }

    /// <summary>
    /// Approve a master's KYC submission
    /// </summary>
    /// <param name="masterId">Master identifier</param>
    [HttpPatch("{masterId:guid}/approve", Name = "ApproveMasterKyc")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Approve([FromRoute] Guid masterId)
    {
        await bus.InvokeAsync(new ApproveMasterKycRequest
        {
            MasterId = masterId,
            ApprovedById = UserId,
        });

        return NoContent();
    }

    /// <summary>
    /// Reject a master's KYC submission with a required reason
    /// </summary>
    /// <param name="masterId">Master identifier</param>
    /// <param name="body">Rejection reason</param>
    [HttpPatch("{masterId:guid}/reject", Name = "RejectMasterKyc")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Reject([FromRoute] Guid masterId, [FromBody] KycRejectRequest body)
    {
        await bus.InvokeAsync(new RejectMasterKycRequest
        {
            MasterId = masterId,
            RejectedById = UserId,
            Reason = body.Reason,
        });

        return NoContent();
    }
}

public record KycRejectRequest([property: System.ComponentModel.DataAnnotations.Required] string Reason);
