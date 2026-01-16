using BeautifyBaltics.Core.API.Application.SeedWork;
using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterAvailabilities;

public record FindMasterAvailabilitiesRequest : PagedRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Filter by start date (slots starting on or after this date)
    /// </summary>
    public DateTime? StartAt { get; init; }

    /// <summary>
    /// Filter by end date (slots ending on or before this date)
    /// </summary>
    public DateTime? EndAt { get; init; }
}
