using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterProfileImage;

public record UploadMasterProfileImageResponse(Guid MasterId)
{
    /// <summary>
    /// Master id
    /// </summary>
    [Required]
    public Guid MasterId { get; init; } = MasterId;
}
