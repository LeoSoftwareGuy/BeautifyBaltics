using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Booking;

public class BookingRepository(IQuerySession session) : QueryRepository<Projections.Booking, BookingSearchDTO>(session), IBookingRepository
{
    public override Task<IPagedList<Projections.Booking>> GetPagedListAsync(BookingSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<Projections.Booking>> GetListAsync(BookingSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToListAsync(cancellationToken);

    private IQueryable<Projections.Booking> BuildSearchQuery(BookingSearchDTO search)
    {
        var query = _session.Query<Projections.Booking>().AsQueryable();

        if (search.ClientId is not null) query = query.Where(x => x.ClientId == search.ClientId);
        if (search.MasterId is not null) query = query.Where(x => x.MasterId == search.MasterId);
        if (search.Status is not null) query = query.Where(x => x.Status == search.Status);

        if (search.From is not null)
        {
            var from = DateTime.SpecifyKind(search.From.Value, DateTimeKind.Unspecified);
            query = query.Where(x => x.ScheduledAt >= from);
        }

        if (search.To is not null)
        {
            var to = DateTime.SpecifyKind(search.To.Value, DateTimeKind.Unspecified);
            query = query.Where(x => x.ScheduledAt <= to);
        }

        if (!string.IsNullOrWhiteSpace(search.Search))
        {
            query = query.Where(x =>
                x.ClientName.Contains(search.Search, StringComparison.OrdinalIgnoreCase) ||
                x.MasterJobTitle.Contains(search.Search, StringComparison.OrdinalIgnoreCase)
            );
        }

        return query.OrderBy(x => x.ScheduledAt);
    }
}
