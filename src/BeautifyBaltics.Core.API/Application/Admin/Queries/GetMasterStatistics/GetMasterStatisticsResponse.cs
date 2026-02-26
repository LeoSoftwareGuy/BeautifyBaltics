namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetMasterStatistics;

public record GetMasterStatisticsResponse
{
    public int TotalMasters { get; init; }
    public int NewMastersThisMonth { get; init; }
    public int ActiveMastersLast30Days { get; init; }
    public int TotalBookingsLast30Days { get; init; }
    public int PendingRequests { get; init; }
}
