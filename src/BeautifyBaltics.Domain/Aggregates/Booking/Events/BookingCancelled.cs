namespace BeautifyBaltics.Domain.Aggregates.Booking.Events
{
    public record BookingCancelled(
        Guid BookingId,
        Guid MasterId,
        Guid MasterAvailabilitySlotId,
        Guid? CancelledByMasterId = null,
        Guid? CancelledByClientId = null
    );
}
