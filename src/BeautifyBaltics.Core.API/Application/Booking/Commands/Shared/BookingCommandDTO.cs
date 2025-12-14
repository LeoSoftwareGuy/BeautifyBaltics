using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.Shared;

public record BookingCommandDTO
{
    /// <summary>
    /// Id of master
    /// </summary>
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Id of client
    /// </summary>
    [Required]
    public Guid ClientId { get; init; }

    /// <summary>
    /// Id of the job
    /// </summary>
    [Required]
    public Guid MasterJobId { get; init; }

    /// <summary>
    /// Booking date and time
    /// </summary>
    [Required]
    public DateTime ScheduledAt { get; init; }

    /// <summary>
    /// Duration of the job
    /// </summary>
    [Range(1, 24 * 60)]
    public TimeSpan DurationMinutes { get; init; }

    /// <summary>
    /// Price of the job
    /// </summary>
    [Range(0, double.MaxValue)]
    public decimal Price { get; init; }
}