using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DefineAvailability;

public record CreateMasterAvailabilityRequest
{
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    [Required]
    public List<MasterAvailabilitySlotCommandDTO> Availability { get; init; } = [];
}
