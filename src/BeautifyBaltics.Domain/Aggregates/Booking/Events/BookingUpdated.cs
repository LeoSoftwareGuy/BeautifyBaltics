namespace BeautifyBaltics.Domain.Aggregates.Booking.Events;

public record BookingUpdated(
    Guid BookingId,
    Guid MasterId,
    Guid ClientId,
    Guid MasterJobId,
    DateTime ScheduledAt,
    TimeSpan Duration,
    decimal Price
);