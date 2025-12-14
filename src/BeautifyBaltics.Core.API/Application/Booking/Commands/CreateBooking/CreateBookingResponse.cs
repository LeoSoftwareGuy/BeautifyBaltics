using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.CreateBooking;

public record CreateBookingResponse(Guid Id)
{
    /// <summary>
    /// Id of created booking
    /// </summary>
    [Required]
    public Guid Id { get; init; } = Id;
}