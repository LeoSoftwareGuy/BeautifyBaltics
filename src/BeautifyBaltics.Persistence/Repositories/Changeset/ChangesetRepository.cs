using BeautifyBaltics.Persistence.Projections.Changesets;
using BeautifyBaltics.Persistence.Repositories.Changeset.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Changeset;

public class ChangesetRepository(IQuerySession session)
    : QueryRepository<Projections.Changesets.Changeset, ChangesetSearchDTO>(session), IChangesetRepository
{
    public override Task<IPagedList<Projections.Changesets.Changeset>> GetPagedListAsync(
        ChangesetSearchDTO search,
        CancellationToken cancellationToken = default) =>
        BuildQuery(search)
            .OrderByDescending(x => x.ProposedAt)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public Task<IReadOnlyList<Projections.Changesets.Changeset>> GetPendingByMasterAsync(
        Guid masterId,
        CancellationToken cancellationToken = default) =>
        _session.Query<Projections.Changesets.Changeset>()
            .Where(x => x.MasterId == masterId && x.Status == ChangesetStatus.Pending)
            .OrderBy(x => x.ProposedAt)
            .ToListAsync(cancellationToken);

    public Task<int> GetPendingCountAsync(CancellationToken cancellationToken = default) =>
        _session.Query<Projections.Changesets.Changeset>()
            .CountAsync(x => x.Status == ChangesetStatus.Pending, cancellationToken);

    private IQueryable<Projections.Changesets.Changeset> BuildQuery(ChangesetSearchDTO search)
    {
        var query = _session.Query<Projections.Changesets.Changeset>().AsQueryable();

        if (search.MasterId is not null) query = query.Where(x => x.MasterId == search.MasterId);

        if (search.Status is not null) query = query.Where(x => x.Status == search.Status);

        return query;
    }
}
