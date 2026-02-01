using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetEarningsPerformance;

public record GetEarningsPerformanceRequest
{
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Time period for earnings data grouping
    /// </summary>
    public EarningsPeriod Period { get; init; } = EarningsPeriod.Monthly;
}
