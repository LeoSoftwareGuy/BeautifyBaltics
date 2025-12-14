using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.UpdateBooking;

public record UpdateBookingResponse(Guid BookingId)
{
    /// <summary>
    /// ID of the updated booking
    /// </summary>
    [Required]
    public Guid BookingId { get; init; } = BookingId;
}