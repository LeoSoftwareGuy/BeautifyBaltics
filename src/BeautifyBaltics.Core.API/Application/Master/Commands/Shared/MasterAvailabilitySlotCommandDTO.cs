using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public record MasterAvailabilitySlotCommandDTO
{
    [Required]
    public DateTime Start { get; init; }

    [Required]
    public DateTime End { get; init; }
}
