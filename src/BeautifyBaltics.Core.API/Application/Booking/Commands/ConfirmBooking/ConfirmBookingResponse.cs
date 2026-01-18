namespace BeautifyBaltics.Core.API.Application.Booking.Commands.ConfirmBooking
{
    public record ConfirmBookingResponse(Guid BookingId)
    {
        public Guid BookingId { get; init; } = BookingId;
    }
}
