using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Rating.Commands.SubmitRating;

public record CreateRatingRequest
{
    /// <summary>
    /// Booking ID to rate
    /// </summary>
    [Required]
    public Guid BookingId { get; init; }

    /// <summary>
    /// Rating value (1-5)
    /// </summary>
    [Required]
    [Range(1, 5)]
    public int Value { get; init; }

    /// <summary>
    /// Optional comment
    /// </summary>
    public string? Comment { get; init; }
}
