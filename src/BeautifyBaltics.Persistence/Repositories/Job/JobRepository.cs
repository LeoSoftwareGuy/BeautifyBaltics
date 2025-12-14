using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Job;

public class JobRepository(IQuerySession session) : QueryRepository<Domain.Documents.Job, JobSearchDTO>(session), IJobRepository
{
    public override Task<IPagedList<Domain.Documents.Job>> GetPagedListAsync(JobSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<Domain.Documents.Job>> GetListAsync(JobSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToListAsync(cancellationToken);

    private IQueryable<Domain.Documents.Job> BuildSearchQuery(JobSearchDTO search)
    {
        var query = _session.Query<Domain.Documents.Job>().AsQueryable();

        if (string.IsNullOrWhiteSpace(search.Text)) return query;

        query = query.Where(x => x.Name.Contains(search.Text));
        query = query.Where(x => x.Description.Contains(search.Text));

        return query;
    }
}
