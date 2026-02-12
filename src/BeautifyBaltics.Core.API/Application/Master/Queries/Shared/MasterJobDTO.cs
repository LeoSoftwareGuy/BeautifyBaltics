using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.Shared;

public record MasterJobDTO
{
    /// <summary>
    /// Master job identifier
    /// </summary>
    [Required]
    public required Guid Id { get; init; }

    /// <summary>
    /// Job identifier
    /// </summary>
    [Required]
    public required Guid JobId { get; init; }

    /// <summary>
    /// Job category identifier
    /// </summary>
    [Required]
    public required Guid JobCategoryId { get; init; }

    /// <summary>
    /// Job category name
    /// </summary>
    [Required]
    public required string JobCategoryName { get; init; }

    /// <summary>
    /// Job name
    /// </summary>
    [Required]
    public required string JobName { get; init; }

    /// <summary>
    /// Job title
    /// </summary>
    [Required]
    public required string Title { get; init; }

    /// <summary>
    /// Job price
    /// </summary>
    [Required]
    public required decimal Price { get; init; }

    /// <summary>
    /// Job duration in minutes
    /// </summary>
    [Required]
    public required int DurationMinutes { get; init; }

    /// <summary>
    /// Featured image identifier
    /// </summary>
    public Guid? FeaturedImageId { get; init; }

    /// <summary>
    /// Job images
    /// </summary>
    [Required]
    public IReadOnlyCollection<MasterJobImageDTO> Images { get; init; } = [];
}
