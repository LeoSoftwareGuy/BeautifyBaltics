namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetClientStatistics;

public record GetClientStatisticsResponse
{
    public int TotalClients { get; init; }
    public int NewClientsThisMonth { get; init; }
    public int ActiveClientsLast30Days { get; init; }
    public int TotalBookingsLast30Days { get; init; }
    public decimal TotalCompletedBookingValue { get; init; }
}
