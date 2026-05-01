using BeautifyBaltics.Persistence.Projections.Changesets;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Changeset.DTOs;

public record ChangesetSearchDTO : BaseSearchDTO
{
    public Guid? MasterId { get; init; }
    public ChangesetStatus? Status { get; init; }
}
