using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DefineAvailability;

public record CreateMasterAvailabilityRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Availability slots
    /// </summary>
    [Required]
    public List<MasterAvailabilitySlotCommandDTO> Availability { get; init; } = [];
}
