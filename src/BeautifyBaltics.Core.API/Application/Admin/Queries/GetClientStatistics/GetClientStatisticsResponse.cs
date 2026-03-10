using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetClientStatistics;

public record GetClientStatisticsResponse
{
    /// <summary>
    /// Total number of clients
    /// </summary>
    [Required]
    public int TotalClients { get; init; }

    /// <summary>
    /// Number of new clients which joined this month
    /// </summary>
    [Required]
    public int NewClientsThisMonth { get; init; }
   
    /// <summary>
    /// Number of active cliens during the last 30 days
    /// </summary>
    [Required]
    public int ActiveClientsLast30Days { get; init; }

    /// <summary>
    /// Total number of bookings the last 30 days
    /// </summary>
    [Required]
    public int TotalBookingsLast30Days { get; init; }

    /// <summary>
    /// Total number of completed bookings
    /// </summary>
    [Required]
    public decimal TotalCompletedBookings { get; init; }
}
