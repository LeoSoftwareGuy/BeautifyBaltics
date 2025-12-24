using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Job.Commands.Shared;

public record JobCommandDTO
{
    /// <summary>
    /// Name
    /// </summary>
    [Required]
    public required string Name { get; init; }

    /// <summary>
    /// Category
    /// </summary>
    [Required]
    public required string Category { get; init; }

    /// <summary>
    /// Desciption
    /// </summary>
    public string Description { get; init; } = string.Empty;

    /// <summary>
    /// Duration in minutes
    /// </summary>
    [Required]
    [Range(1, 24 * 60)]
    public int DurationMinutes { get; init; }

    /// <summary>
    /// Images
    /// </summary>
    public IReadOnlyCollection<string> Images { get; init; } = [];
}
