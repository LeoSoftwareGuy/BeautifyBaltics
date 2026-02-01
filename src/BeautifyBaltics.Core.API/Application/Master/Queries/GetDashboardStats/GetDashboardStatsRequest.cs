using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetDashboardStats;

public record GetDashboardStatsRequest
{
    [Required]
    public Guid MasterId { get; init; }
}
