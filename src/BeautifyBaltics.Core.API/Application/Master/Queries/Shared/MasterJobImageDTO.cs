using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.Shared;

public record MasterJobImageDTO
{
    /// <summary>
    /// Image identifier
    /// </summary>
    [Required]
    public Guid Id { get; init; }

    /// <summary>
    /// Image file name
    /// </summary>
    [Required]
    public required string FileName { get; init; }

    /// <summary>
    /// Image file mime type
    /// </summary>
    [Required]
    public required string FileMimeType { get; init; }

    /// <summary>
    /// Image file size
    /// </summary>
    [Required]
    public long FileSize { get; init; }

    /// <summary>
    /// Direct URL to the image in blob storage
    /// </summary>
    [Required]
    public required string Url { get; init; }
}
