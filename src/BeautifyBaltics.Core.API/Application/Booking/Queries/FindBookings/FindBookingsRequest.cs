using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Booking.Queries.FindBookings;

public record FindBookingsRequest : PagedRequest
{
    /// <summary>
    /// Filter by master id
    /// </summary>
    public Guid? MasterId { get; init; }

    /// <summary>
    /// Filter by client id
    /// </summary>
    public Guid? ClientId { get; init; }

    /// <summary>
    /// Filter by status
    /// </summary>
    public BookingStatus? Status { get; init; }

    /// <summary>
    /// Filter by scheduled date range [from, to] (inclusive)
    /// </summary>
    public DateOnly?[]? ScheduledDateRange { get; init; }

    /// <summary>
    /// Search by client name or job title
    /// </summary>
    public string? Search { get; init; }
}