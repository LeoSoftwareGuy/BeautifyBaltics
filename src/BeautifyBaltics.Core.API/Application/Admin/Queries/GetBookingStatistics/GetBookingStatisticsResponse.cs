namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetBookingStatistics;

public record GetBookingStatisticsResponse
{
    /// <summary>
    /// Total number of bookings
    /// </summary>
    public long TotalBookings { get; init; }

    /// <summary>
    /// Number of confirmed bookings
    /// </summary>
    public long Confirmed { get; init; }

    /// <summary>
    /// Number of pending (requested) bookings
    /// </summary>
    public long Pending { get; init; }

    /// <summary>
    /// Total revenue from non-cancelled bookings this month
    /// </summary>
    public decimal RevenueThisMonth { get; init; }
}
