using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetServiceStatistics;

public record GetServiceStatisticsResponse
{
    /// <summary>
    /// Total services number
    /// </summary>
    [Required]
    public long TotalServices { get; init; }

    /// <summary>
    /// Total categories number
    /// </summary>
    [Required]
    public long TotalCategories { get; init; }

}
