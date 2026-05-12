using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Booking.DTOs;

public record BookingSearchDTO : BaseSearchDTO
{
    public Guid? MasterId { get; init; }
    public Guid? ClientId { get; init; }
    public IReadOnlyList<Guid>? MasterIds { get; init; }
    public IReadOnlyList<Guid>? ClientIds { get; init; }
    public BookingStatus? Status { get; init; }
    public DateOnly?[]? ScheduledDateRange { get; init; }
    public string? Search { get; init; }
}
