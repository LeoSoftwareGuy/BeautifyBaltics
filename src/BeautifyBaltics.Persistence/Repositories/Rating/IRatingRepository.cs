using BeautifyBaltics.Persistence.Repositories.Rating.DTOs;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Rating;

public interface IRatingRepository : IQueryRepository<Projections.Rating, RatingSearchDTO>
{
    Task<Projections.Rating?> GetByBookingIdAsync(Guid bookingId, CancellationToken cancellationToken = default);
    Task<(decimal AverageRating, int RatingCount)> GetMasterRatingStatsAsync(Guid masterId, CancellationToken cancellationToken = default);
}
