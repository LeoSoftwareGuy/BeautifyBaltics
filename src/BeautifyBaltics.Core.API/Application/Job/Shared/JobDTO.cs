using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Job.Shared;

public record JobDTO
{
    [Required]
    public Guid Id { get; init; }

    [Required]
    public required string Name { get; init; }

    [Required]
    public required string Category { get; init; }

    public required string Description { get; init; }

    [Range(1, 24 * 60)]
    public required int DurationMinutes { get; init; }

    public IReadOnlyCollection<string> Images { get; init; } = [];
}
