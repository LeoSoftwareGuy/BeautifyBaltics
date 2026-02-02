using BeautifyBaltics.Persistence.Repositories.Rating.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Rating;

public class RatingRepository(IQuerySession session) : QueryRepository<Projections.Rating, RatingSearchDTO>(session), IRatingRepository
{
    public override Task<IPagedList<Projections.Rating>> GetPagedListAsync(RatingSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .OrderByDescending(x => x.SubmittedAt)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<Projections.Rating>> GetListAsync(RatingSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .OrderByDescending(x => x.SubmittedAt)
            .ToListAsync(cancellationToken);

    public Task<Projections.Rating?> GetByBookingIdAsync(Guid bookingId, CancellationToken cancellationToken = default) =>
        _session.Query<Projections.Rating>().FirstOrDefaultAsync(x => x.BookingId == bookingId, cancellationToken);

    public async Task<(decimal AverageRating, int RatingCount)> GetMasterRatingStatsAsync(Guid masterId, CancellationToken cancellationToken = default)
    {
        var ratings = await _session.Query<Projections.Rating>()
            .Where(x => x.MasterId == masterId)
            .ToListAsync(cancellationToken);

        if (ratings.Count == 0) return (0, 0);

        var average = (decimal)ratings.Average(x => x.Value);
        return (Math.Round(average, 2), ratings.Count);
    }

    private IQueryable<Projections.Rating> BuildSearchQuery(RatingSearchDTO search)
    {
        var query = _session.Query<Projections.Rating>().AsQueryable();

        if (search.MasterId is not null) query = query.Where(x => x.MasterId == search.MasterId);
        if (search.ClientId is not null) query = query.Where(x => x.ClientId == search.ClientId);
        if (search.BookingId is not null) query = query.Where(x => x.BookingId == search.BookingId);

        return query;
    }
}
