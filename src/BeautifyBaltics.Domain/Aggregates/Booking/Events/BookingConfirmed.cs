namespace BeautifyBaltics.Domain.Aggregates.Booking.Events;

public record BookingConfirmed(Guid BookingId, Guid MasterId);
