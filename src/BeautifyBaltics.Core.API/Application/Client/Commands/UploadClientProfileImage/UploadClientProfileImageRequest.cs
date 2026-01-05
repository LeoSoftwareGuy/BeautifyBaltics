using BeautifyBaltics.Core.API.Application.SeedWork;
using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.UploadClientProfileImage;

public record UploadClientProfileImageRequest : CreateFileImageCommandDTO
{
    /// <summary>
    /// Client id
    /// </summary>
    [Required]
    [Identity]
    public Guid ClientId { get; init; }
}
