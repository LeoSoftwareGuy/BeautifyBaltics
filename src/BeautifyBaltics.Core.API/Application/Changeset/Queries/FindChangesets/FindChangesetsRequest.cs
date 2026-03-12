using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Projections.Changesets;

namespace BeautifyBaltics.Core.API.Application.Changeset.Queries.FindChangesets;

public record FindChangesetsRequest : PagedRequest
{
    public Guid? MasterId { get; init; }
    public ChangesetStatus? Status { get; init; }
}
