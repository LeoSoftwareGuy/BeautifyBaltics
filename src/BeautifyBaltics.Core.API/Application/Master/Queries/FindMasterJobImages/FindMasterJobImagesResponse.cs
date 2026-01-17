using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterJobImages;

public record FindMasterJobImagesResponse
{
    public IEnumerable<MasterJobImageWithUrlDTO> Images { get; init; } = [];
}

public record MasterJobImageWithUrlDTO
{
    /// <summary>
    /// Image identifier
    /// </summary>
    [Required]
    public Guid Id { get; init; }

    /// <summary>
    /// Master job identifier
    /// </summary>
    [Required]
    public Guid JobId { get; init; }

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
