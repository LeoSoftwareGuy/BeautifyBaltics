using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetMasterStatistics;

public record GetMasterStatisticsResponse
{
    /// <summary>
    /// Total number of masters
    /// </summary>
    [Required]
    public int TotalMasters { get; init; }

    /// <summary>
    /// Number of new masters this month
    /// </summary>
    [Required]
    public int NewMastersThisMonth { get; init; }

    /// <summary>
    /// Number of active masters during last 30 days
    /// </summary>
    [Required]
    public int ActiveMastersLast30Days { get; init; }

    /// <summary>
    /// Total number of bookings during last 30 days
    /// </summary>
    [Required]
    public int TotalBookingsLast30Days { get; init; }

    /// <summary>
    /// Number of pending requests
    /// </summary>
    [Required]
    public int PendingRequests { get; init; }
}
