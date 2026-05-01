using BeautifyBaltics.Persistence.Repositories.Changeset.DTOs;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Changeset;

public interface IChangesetRepository : IQueryRepository<Projections.Changesets.Changeset, ChangesetSearchDTO>
{
    Task<IReadOnlyList<Projections.Changesets.Changeset>> GetPendingByMasterAsync(Guid masterId, CancellationToken cancellationToken = default);
    Task<int> GetPendingCountAsync(CancellationToken cancellationToken = default);
}
