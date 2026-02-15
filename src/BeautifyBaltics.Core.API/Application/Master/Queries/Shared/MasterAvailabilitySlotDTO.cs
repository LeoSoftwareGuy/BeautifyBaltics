using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.Shared;

public record MasterAvailabilitySlotDTO
{
    /// <summary>
    /// Identifier
    /// </summary>
    [Required]
    public Guid Id { get; init; }

    /// <summary>
    /// Master identifer
    /// </summary>
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Master name
    /// </summary>
    [Required]
    public required string MasterName { get; init; }

    /// <summary>
    /// Starts at
    /// </summary>
    [Required]
    public DateTime StartAt { get; init; }

    /// <summary>
    /// Ends at
    /// </summary>
    [Required]
    public DateTime EndAt { get; init; }

    /// <summary>
    /// Slot type (Available or Break)
    /// </summary>
    public AvailabilitySlotType SlotType { get; init; } = AvailabilitySlotType.Available;
}
