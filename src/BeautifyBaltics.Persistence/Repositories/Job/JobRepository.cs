using BeautifyBaltics.Persistence.Repositories.Job.DTOs;
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

        if (search.Name is not null) query = query.Where(x => x.Name.NgramSearch(search.Name));

        if (search.CategoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == search.CategoryId.Value);
        }

        return query;
    }
}
