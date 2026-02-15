using System.ComponentModel.DataAnnotations;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterBufferTime;

public record UpdateMasterBufferTimeRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Buffer time in minutes between bookings (0-60)
    /// </summary>
    [Required]
    [Range(0, 60)]
    public int BufferMinutes { get; init; }
}
