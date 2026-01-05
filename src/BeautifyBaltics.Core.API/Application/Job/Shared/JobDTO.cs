using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Job.Shared;

public record JobDTO
{
    [Required]
    public Guid Id { get; init; }

    [Required]
    public required string Name { get; init; }

    [Required]
    public required Guid CategoryId { get; init; }

    [Required]
    public required string CategoryName { get; init; }

    [Required]
    public required string Description { get; init; }

    [Range(1, 24 * 60)]
    public required int DurationMinutes { get; init; }
}
