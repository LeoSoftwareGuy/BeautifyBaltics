using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Rating.DTOs;

public record RatingSearchDTO : BaseSearchDTO
{
    public Guid? MasterId { get; init; }
    public Guid? ClientId { get; init; }
    public Guid? BookingId { get; init; }
}
