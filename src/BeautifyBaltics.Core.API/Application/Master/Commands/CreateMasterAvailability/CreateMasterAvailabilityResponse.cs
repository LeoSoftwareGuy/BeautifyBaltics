using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DefineAvailability;

public record CreateMasterAvailabilityResponse(Guid MasterId)
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Required]
    public Guid MasterId { get; init; } = MasterId;
}
