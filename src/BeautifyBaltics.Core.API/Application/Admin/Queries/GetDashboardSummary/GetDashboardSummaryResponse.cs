using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetDashboardSummary;

public record GetDashboardSummaryResponse
{
    /// <summary>
    /// Total number of clients
    /// </summary>
    [Required]
    public required int TotalClients { get; init; }

    /// <summary>
    /// Total number of masters
    /// </summary>
    [Required]
    public required int TotalMasters { get; init; }

    /// <summary>
    /// Total number of bookings
    /// </summary>
    [Required]
    public required long TotalBookings { get; init; }

    /// <summary>
    /// Total revenue
    /// </summary>
    [Required]
    public required decimal TotalRevenue { get; init; }

    /// <summary>
    /// Monthly performance stats
    /// </summary>
    [Required]
    public required IReadOnlyList<MonthlyBookingStat> MonthlyPerformance { get; init; }

    /// <summary>
    /// Recent activities stats
    /// </summary>
    [Required]
    public required IReadOnlyList<DashboardRecentActivity> RecentActivities { get; init; }

    /// <summary>
    /// Service categories
    /// </summary>
    [Required]
    public required IReadOnlyList<ServiceCategoryRevenueStat> ServiceCategories { get; init; }
}

public record MonthlyBookingStat(int Year, int Month, int Completed, int Confirmed, int Cancelled);

public record DashboardRecentActivity(
    string ClientName,
    string ServiceName,
    string MasterName,
    decimal Price,
    string Status,
    DateTime BookedAt
);

public record ServiceCategoryRevenueStat(string CategoryName, decimal Revenue, int Percentage);
