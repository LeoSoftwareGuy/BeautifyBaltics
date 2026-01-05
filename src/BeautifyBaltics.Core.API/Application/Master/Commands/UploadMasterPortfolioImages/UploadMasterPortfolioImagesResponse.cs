using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterPortfolioImages;

public record UploadMasterPortfolioImagesResponse(Guid MasterId)
{
    /// <summary>
    /// Master id
    /// </summary>
    [Required]
    public Guid MasterId { get; init; } = MasterId;
}