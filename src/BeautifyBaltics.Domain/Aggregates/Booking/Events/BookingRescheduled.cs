namespace BeautifyBaltics.Domain.Aggregates.Booking.Events;

public record BookingRescheduled(
    Guid BookingId,
    DateTime ScheduledAt,
    TimeSpan Duration
);