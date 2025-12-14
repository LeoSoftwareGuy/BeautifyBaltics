using Marten.Schema;
using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Core.API.Application.Booking.Commands.Shared;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.UpdateBooking;

public record UpdateBookingRequest : BookingCommandDTO
{
    /// <summary>
    /// Booking ID
    /// </summary>
    [Required]
    [Identity]
    public required Guid BookingId { get; init; }
}