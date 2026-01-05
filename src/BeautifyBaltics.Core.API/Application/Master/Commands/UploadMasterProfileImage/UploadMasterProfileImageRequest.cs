using BeautifyBaltics.Core.API.Application.SeedWork;
using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterProfileImage;

public record UploadMasterProfileImageRequest : CreateFileImageCommandDTO
{
    /// <summary>
    /// Master id
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }
}
