using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public record MasterJobOfferingCommandDTO
{
    /// <summary>
    /// Job identifier
    /// </summary>
    [Required]
    public Guid JobId { get; init; }

    /// <summary>
    /// Title to be displayed to clients
    /// </summary>
    [Required]
    public required string Title { get; init; }

    /// <summary>
    /// Price to be paid for the service
    /// </summary>
    [Required]
    public decimal Price { get; init; }

    /// <summary>
    /// Duration of the service
    /// </summary>
    [Required]
    public int DurationMinutes { get; init; }
}
