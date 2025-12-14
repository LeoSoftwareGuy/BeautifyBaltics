using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Booking;

public record BookingSearchDTO : BaseSearchDTO
{
    public Guid? MasterId { get; init; }
    public Guid? ClientId { get; init; }
    public BookingStatus? Status { get; init; }
    public DateTime? From { get; init; }
    public DateTime? To { get; init; }
}
