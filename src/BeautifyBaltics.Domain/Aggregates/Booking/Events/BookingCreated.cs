namespace BeautifyBaltics.Domain.Aggregates.Booking.Events;

public record BookingCreated(
    Guid MasterId,
    Guid ClientId,
    Guid MasterJobId,
    Guid MasterAvailabilitySlotId,
    DateTime ScheduledAt,
    TimeSpan Duration,
    decimal Price
);