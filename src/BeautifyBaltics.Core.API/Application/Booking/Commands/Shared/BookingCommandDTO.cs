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
    /// Id of the master job
    /// </summary>
    [Required]
    public Guid MasterJobId { get; init; }

    /// <summary>
    /// The scheduled start time for the booking
    /// </summary>
    [Required]
    public DateTime ScheduledAt { get; init; }
}
