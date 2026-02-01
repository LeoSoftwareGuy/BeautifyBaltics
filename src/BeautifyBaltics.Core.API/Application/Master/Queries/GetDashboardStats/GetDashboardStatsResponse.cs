using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetDashboardStats;

public record GetDashboardStatsResponse
{
    /// <summary>
    /// Total number of bookings (excluding cancelled)
    /// </summary>
    [Required]
    public int TotalBookings { get; init; }

    /// <summary>
    /// Percentage change in bookings compared to previous month
    /// </summary>
    [Required]
    public decimal TotalBookingsChange { get; init; }

    /// <summary>
    /// Average monthly earnings from completed bookings
    /// </summary>
    [Required]
    public decimal MonthlyEarningsAverage { get; init; }

    /// <summary>
    /// Percentage change in earnings compared to previous month
    /// </summary>
    [Required]
    public decimal MonthlyEarningsChange { get; init; }

    /// <summary>
    /// Number of pending booking requests
    /// </summary>
    [Required]
    public int PendingRequestsCount { get; init; }
}
