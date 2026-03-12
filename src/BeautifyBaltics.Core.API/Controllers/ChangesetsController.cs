using BeautifyBaltics.Core.API.Application.Changeset.Commands.ApproveChangeset;
using BeautifyBaltics.Core.API.Application.Changeset.Commands.RejectChangeset;
using BeautifyBaltics.Core.API.Application.Changeset.Queries.FindChangesets;
using BeautifyBaltics.Core.API.Application.Changeset.Queries.GetPendingChangesetsCount;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using BeautifyBaltics.Domain.Enumerations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[Authorize(Roles = nameof(UserRole.Admin))]
[Route("admin/changesets")]
public class ChangesetsController(IMessageBus bus) : ApiController
{
    [HttpGet(Name = "FindChangesets")]
    [ProducesResponseType(typeof(PagedResponse<FindChangesetsResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<FindChangesetsResponse>>> FindChangesets(
        [FromQuery] FindChangesetsRequest request,
        CancellationToken cancellationToken
    )
    {
        var response = await bus.InvokeAsync<PagedResponse<FindChangesetsResponse>>(request, cancellationToken);
        return Ok(response);
    }

    [HttpGet("pending-count", Name = "GetPendingChangesetsCount")]
    [ProducesResponseType(typeof(GetPendingChangesetsCountResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetPendingChangesetsCountResponse>> GetPendingCount(CancellationToken cancellationToken)
    {
        var response = await bus.InvokeAsync<GetPendingChangesetsCountResponse>(
            new GetPendingChangesetsCountRequest(), cancellationToken);
        return Ok(response);
    }

    [HttpPatch("{masterId:guid}/{changesetId:guid}/approve", Name = "ApproveChangeset")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ApproveChangeset(
        [FromRoute] Guid masterId,
        [FromRoute] Guid changesetId,
        [FromBody] ChangesetActionRequest? body,
        CancellationToken cancellationToken
    )
    {
        await bus.InvokeAsync(new ApproveChangesetRequest
        {
            MasterId = masterId,
            ChangesetId = changesetId,
            ApprovedById = UserId,
            Comment = body?.Comment,
        }, cancellationToken);

        return NoContent();
    }

    [HttpPatch("{masterId:guid}/{changesetId:guid}/reject", Name = "RejectChangeset")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RejectChangeset(
        [FromRoute] Guid masterId,
        [FromRoute] Guid changesetId,
        [FromBody] ChangesetActionRequest? body,
        CancellationToken cancellationToken
    )
    {
        await bus.InvokeAsync(new RejectChangesetRequest
        {
            MasterId = masterId,
            ChangesetId = changesetId,
            RejectedById = UserId,
            Comment = body?.Comment,
        }, cancellationToken);

        return NoContent();
    }
}

public record ChangesetActionRequest(string? Comment);
