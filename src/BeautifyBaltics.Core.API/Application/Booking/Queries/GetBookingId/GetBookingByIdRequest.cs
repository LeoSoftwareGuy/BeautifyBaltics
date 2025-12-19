using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Booking.Queries.GetBookingId;

public record GetBookingByIdRequest
{
    /// <summary>
    /// Id
    /// </summary>
    [Required]
    public Guid Id { get; init; }
}