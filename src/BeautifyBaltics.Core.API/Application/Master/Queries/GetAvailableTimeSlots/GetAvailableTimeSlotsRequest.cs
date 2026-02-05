using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetAvailableTimeSlots;

public record GetAvailableTimeSlotsRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }

    /// <summary>
    /// The date to get available slots for
    /// </summary>
    [Required]
    public DateTime Date { get; init; }

    /// <summary>
    /// Duration of the service in minutes
    /// </summary>
    [Required]
    public int ServiceDurationMinutes { get; init; }

    /// <summary>
    /// Interval between slot start times in minutes (default: 30)
    /// </summary>
    public int SlotIntervalMinutes { get; init; } = 30;
}
