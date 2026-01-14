using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public record MasterAvailabilitySlotCommandDTO
{
    /// <summary>
    /// Slot starts at
    /// </summary>
    [Required]
    public DateTime Start { get; init; }

    /// <summary>
    /// Slot ends at
    /// </summary>
    [Required]
    public DateTime End { get; init; }
}
