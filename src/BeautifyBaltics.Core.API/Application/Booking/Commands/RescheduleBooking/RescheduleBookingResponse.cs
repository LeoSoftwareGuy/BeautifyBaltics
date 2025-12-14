using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.RescheduleBooking;

public record RescheduleBookingResponse(Guid Id)
{
    /// <summary>
    /// Id of created booking
    /// </summary>
    [Required]
    public Guid Id { get; init; } = Id;
}