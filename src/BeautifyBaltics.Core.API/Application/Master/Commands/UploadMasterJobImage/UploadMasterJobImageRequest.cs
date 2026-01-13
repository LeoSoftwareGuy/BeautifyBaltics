using BeautifyBaltics.Core.API.Application.SeedWork;
using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterJobImage;

public record UploadMasterJobImageRequest : CreateFileImageCommandDTO
{
    /// <summary>
    /// Master id
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Master job id
    /// </summary>
    [Required]
    public Guid MasterJobId { get; init; }
}
