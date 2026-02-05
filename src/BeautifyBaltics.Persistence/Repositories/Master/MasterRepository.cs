using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Master;

public class MasterRepository(IQuerySession session) : QueryRepository<Projections.Master, MasterSearchDTO>(session), IMasterRepository
{
    public Task<Projections.Master?> GetBySupabaseUserIdAsync(string supabaseUserId, CancellationToken cancellationToken = default) =>
        _session.Query<Projections.Master>()
            .FirstOrDefaultAsync(x => x.SupabaseUserId == supabaseUserId, cancellationToken);

    public override Task<IPagedList<Projections.Master>> GetPagedListAsync(MasterSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<Projections.Master>> GetListAsync(MasterSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToListAsync(cancellationToken);

    private IQueryable<Projections.Master> BuildSearchQuery(MasterSearchDTO search)
    {
        var query = _session.Query<Projections.Master>().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search.Text))
        {
            query = query.Where(x => x.FirstName.NgramSearch(search.Text) || x.LastName.NgramSearch(search.Text));
        }

        if (!string.IsNullOrWhiteSpace(search.City))
        {
            query = query.Where(x => x.City.NgramSearch(search.City));
        }

        if (search.JobCategoryId is not null|| search.MinPrice is not null || search.MaxPrice is not null)
        {
            var jobQuery = _session.Query<MasterJob>().AsQueryable();

            if (search.JobCategoryId is not null) jobQuery = jobQuery.Where(job => job.JobCategoryId == search.JobCategoryId);

            if (search.MinPrice is not null) jobQuery = jobQuery.Where(job => job.Price >= search.MinPrice);

            if (search.MaxPrice is not null) jobQuery = jobQuery.Where(job => job.Price <= search.MaxPrice);

            var masterIds = jobQuery.Select(job => job.MasterId).ToList();

            query = query.Where(x => masterIds.Contains(x.Id));
        }

        return query;
    }
}
