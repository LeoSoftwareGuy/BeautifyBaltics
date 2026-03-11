namespace BeautifyBaltics.Domain.Aggregates.Booking.Events;

public record BookingCompleted(
    Guid BookingId,
    DateTime CompletedAt,
    Guid MasterId,
    Guid ClientId,
    decimal Price
);
