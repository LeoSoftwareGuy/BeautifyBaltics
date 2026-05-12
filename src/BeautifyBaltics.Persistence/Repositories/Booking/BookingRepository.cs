using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Booking;

public class BookingRepository(IQuerySession session) : QueryRepository<Projections.Booking, BookingSearchDTO>(session), IBookingRepository
{
    public override Task<IPagedList<Projections.Booking>> GetPagedListAsync(BookingSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<Projections.Booking>> GetListAsync(BookingSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .ToListAsync(cancellationToken);

    private IQueryable<Projections.Booking> BuildSearchQuery(BookingSearchDTO search)
    {
        var query = _session.Query<Projections.Booking>().AsQueryable();

        if (search.ClientId is not null) query = query.Where(x => x.ClientId == search.ClientId);
        if (search.MasterId is not null) query = query.Where(x => x.MasterId == search.MasterId);

        if (search.ClientIds is { Count: > 0 })
        {
            var ids = search.ClientIds;
            query = query.Where(x => ids.Contains(x.ClientId));
        }

        if (search.MasterIds is { Count: > 0 })
        {
            var ids = search.MasterIds;
            query = query.Where(x => ids.Contains(x.MasterId));
        }
        if (search.Status is not null) query = query.Where(x => x.Status == search.Status);

        if (search.ScheduledDateRange is not null)
        {
            var from = search.ScheduledDateRange[0];
            var to = search.ScheduledDateRange[1];
            if (from is not null) query = query.Where(x => x.ScheduledAt >= from.Value.ToDateTime(TimeOnly.MinValue));
            if (to is not null) query = query.Where(x => x.ScheduledAt <= to.Value.ToDateTime(TimeOnly.MaxValue));
        }

        if (!string.IsNullOrWhiteSpace(search.Search))
        {
            query = query.Where(x =>
                x.ClientName.Contains(search.Search, StringComparison.OrdinalIgnoreCase) ||
                x.MasterJobTitle.Contains(search.Search, StringComparison.OrdinalIgnoreCase)
            );
        }

        return query.SortBy(search.SortBy, search.Ascending);
    }
}
