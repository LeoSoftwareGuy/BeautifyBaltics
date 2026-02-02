using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Rating.Commands.SubmitRating;

public record CreateRatingResponse(Guid Id)
{
    /// <summary>
    /// ID of created rating
    /// </summary>
    [Required]
    public Guid Id { get; init; } = Id;
}
