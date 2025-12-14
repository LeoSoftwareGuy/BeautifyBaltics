using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Domain.Aggregates.Booking.Events;

public record BookingStatusChanged(
    Guid BookingId,
    BookingStatus Status
);
