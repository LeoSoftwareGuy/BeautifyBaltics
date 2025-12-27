using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DefineAvailability;

public record CreateMasterAvailabilityRequest
{
    [Required]
    public Guid MasterId { get; init; }

    [Required]
    public List<MasterAvailabilitySlotCommandDTO> Availability { get; init; } = [];
}
