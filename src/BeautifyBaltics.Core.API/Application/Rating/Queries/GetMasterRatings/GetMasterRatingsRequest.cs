using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Core.API.Application.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Rating.Queries.GetMasterRatings;

public record GetMasterRatingsRequest : PagedRequest
{
    /// <summary>
    /// Master ID to get ratings for
    /// </summary>
    [Required]
    public Guid MasterId { get; init; }
}
