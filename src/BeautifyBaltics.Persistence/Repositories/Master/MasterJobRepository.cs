using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Master;

public class MasterJobRepository(IQuerySession session)
    : QueryRepository<MasterJob, MasterJobSearchDTO>(session), IMasterJobRepository
{
    public override Task<IPagedList<Projections.MasterJob>> GetPagedListAsync(MasterJobSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<Projections.MasterJob>> GetListAsync(MasterJobSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToListAsync(cancellationToken);

    private IQueryable<Projections.MasterJob> BuildSearchQuery(MasterJobSearchDTO search)
    {
        var query = _session.Query<Projections.MasterJob>().AsQueryable();

        return query;
    }
}