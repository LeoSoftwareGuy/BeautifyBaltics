using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Contracts.Jobs;

public record CreateJobRequest
{
    [Required]
    public string Name { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    [Range(1, 24 * 60)]
    public int DurationMinutes { get; init; }

    public List<string> Images { get; init; } = new();
}

public record JobResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int DurationMinutes { get; init; }
    public IReadOnlyCollection<string> Images { get; init; } = Array.Empty<string>();
}
