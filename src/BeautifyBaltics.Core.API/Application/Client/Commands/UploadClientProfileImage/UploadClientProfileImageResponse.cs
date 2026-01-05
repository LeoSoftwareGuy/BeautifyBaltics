using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.UploadClientProfileImage;

public record UploadClientProfileImageResponse(Guid ClientId)
{
    /// <summary>
    /// Client id
    /// </summary>
    [Required]
    public Guid ClientId { get; init; } = ClientId;
}
