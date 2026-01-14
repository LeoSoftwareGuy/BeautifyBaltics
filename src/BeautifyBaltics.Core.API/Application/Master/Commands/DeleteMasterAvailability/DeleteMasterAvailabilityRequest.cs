using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterAvailability;

public record DeleteMasterAvailabilityRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Master availability identifier
    /// </summary>
    [Required]
    public Guid MasterAvailabilityId { get; init; }
}
