namespace BeautifyBaltics.Core.API.Application.Booking.Commands.UpdateStatusBooking
{
    public record UpdateStatusBookingResponse(Guid BookingId)
    {
        public Guid BookingId { get; init; } = BookingId;
    }
}
