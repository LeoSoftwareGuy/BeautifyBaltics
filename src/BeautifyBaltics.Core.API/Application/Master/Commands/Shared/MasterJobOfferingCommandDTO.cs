using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public record MasterJobOfferingCommandDTO
{
    [Required]
    public Guid JobId { get; init; }

    [Required]
    [MaxLength(256)]
    public string Title { get; init; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Price { get; init; }

    [Range(1, 24 * 60)]
    public int DurationMinutes { get; init; }
}
