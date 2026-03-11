using AdminUserStats = BeautifyBaltics.Persistence.Projections.AdminUserStatistics;
using BeautifyBaltics.Persistence.Repositories.User.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.AdminUserStatistics;

public class AdminUserStatisticsRepository(IQuerySession session)
    : QueryRepository<AdminUserStats, UserSearchDTO>(session), IAdminUserStatisticsRepository
{
    public override Task<IPagedList<AdminUserStats>> GetPagedListAsync(UserSearchDTO search,
        CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<AdminUserStats>> GetListAsync(UserSearchDTO search,
        CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToListAsync(cancellationToken);

    public Task<IReadOnlyList<AdminUserStats>> GetByUserIdsAsync(IEnumerable<Guid> userIds,
        CancellationToken cancellationToken = default) =>
        _session.Query<AdminUserStats>()
            .Where(x => userIds.Contains(x.Id))
            .ToListAsync(cancellationToken);

    private IQueryable<AdminUserStats> BuildSearchQuery(UserSearchDTO search)
    {
        var query = _session.Query<AdminUserStats>().AsQueryable();

        if (search.Role is not null) query = query.Where(x => x.Role == search.Role);
        if (!string.IsNullOrWhiteSpace(search.FirstName)) query = query.Where(x => x.FirstName.NgramSearch(search.FirstName));
        if (!string.IsNullOrWhiteSpace(search.LastName)) query = query.Where(x => x.LastName.NgramSearch(search.LastName));
        if (!string.IsNullOrWhiteSpace(search.Email)) query = query.Where(x => x.Email.NgramSearch(search.Email));

        if (!string.IsNullOrWhiteSpace(search.Search))
        {
            var text = search.Search;
            query = query.Where(x =>
                x.FirstName.NgramSearch(text) ||
                x.LastName.NgramSearch(text) ||
                x.Email.NgramSearch(text));
        }

        if (search.TotalBookings is not null)
        {
            var threshold = search.TotalBookings.Value;
            query = query.Where(x => x.TotalBookings >= threshold);
        }

        if (search.Rating is not null)
        {
            var minRating = search.Rating.Value;
            query = query.Where(x => x.Rating >= minRating);
        }

        if (search.Earnings is not null)
        {
            var minEarnings = search.Earnings.Value;
            query = query.Where(x => x.Earnings >= minEarnings);
        }

        return query;
    }
}
