using BeautifyBaltics.Core.API.Application.SeedWork;
using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterPortfolioImages;

public record UploadMasterPortfolioImagesRequest : CreateFileImageCommandDTO
{
    /// <summary>
    /// Master id
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }
}
