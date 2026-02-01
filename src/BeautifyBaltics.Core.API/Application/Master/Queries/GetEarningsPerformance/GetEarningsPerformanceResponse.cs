using BeautifyBaltics.Domain.Enumerations;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetEarningsPerformance;

public record GetEarningsPerformanceResponse
{
    /// <summary>
    /// The period type used for grouping
    /// </summary>
    [Required]
    public EarningsPeriod Period { get; init; }

    /// <summary>
    /// Earnings data points grouped by the selected period
    /// </summary>
    public IReadOnlyList<EarningsDataPoint> Data { get; init; } = [];

    /// <summary>
    /// Total earnings for the entire period
    /// </summary>
    [Required]
    public decimal Total { get; init; }
}

public record EarningsDataPoint
{
    /// <summary>
    /// Label for the data point (e.g., "Mon", "Jan", "2024")
    /// </summary>
    [Required]
    public required string Label { get; init; }

    /// <summary>
    /// Earnings value for this period
    /// </summary>
    [Required]
    public decimal Value { get; init; }
}
