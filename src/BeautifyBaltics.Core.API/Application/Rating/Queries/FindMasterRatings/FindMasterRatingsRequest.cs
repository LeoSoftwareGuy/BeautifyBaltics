using BeautifyBaltics.Core.API.Application.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Rating.Queries.FindMasterRatings;

public record FindMasterRatingsRequest : PagedRequest
{
    /// <summary>
    /// Filter by client ID
    /// </summary>
    public Guid? ClientId { get; init; }

    /// <summary>
    /// Filter by booking ID
    /// </summary>
    public Guid? BookingId { get; init; }

    /// <summary>
    /// Filter by master ID
    /// </summary>
    public Guid? MasterId { get; init; }
}
