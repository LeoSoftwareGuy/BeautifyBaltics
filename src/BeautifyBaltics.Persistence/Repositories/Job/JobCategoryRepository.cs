using BeautifyBaltics.Persistence.Repositories.Job.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Job;

public class JobCategoryRepository(IQuerySession session)
    : QueryRepository<Domain.Documents.JobCategory, JobCategorySearchDTO>(session), IJobCategoryRepository
{
    public override Task<IPagedList<Domain.Documents.JobCategory>> GetPagedListAsync(JobCategorySearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<Domain.Documents.JobCategory>> GetListAsync(JobCategorySearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToListAsync(cancellationToken);

    private IQueryable<Domain.Documents.JobCategory> BuildSearchQuery(JobCategorySearchDTO search)
    {
        var query = _session.Query<Domain.Documents.JobCategory>().AsQueryable();

        if (search.Name is not null) query = query.Where(x => x.Name.NgramSearch(search.Name));

        return query;
    }
}
