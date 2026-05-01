namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetUserStatistics;

public record GetUserStatisticsResponse
{
    /// <summary>
    /// Total number of registered users
    /// </summary>
    public long TotalUsers { get; init; }

    /// <summary>
    /// Total number of masters
    /// </summary>
    public long TotalMasters { get; init; }

    /// <summary>
    /// Total number of clients
    /// </summary>
    public long TotalClients { get; init; }

    /// <summary>
    /// Total platform revenue from completed bookings
    /// </summary>
    public decimal PlatformVolume { get; init; }
}
