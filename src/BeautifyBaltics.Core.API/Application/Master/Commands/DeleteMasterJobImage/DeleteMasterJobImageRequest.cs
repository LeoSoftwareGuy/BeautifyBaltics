using System.ComponentModel.DataAnnotations;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterJobImage;

public record DeleteMasterJobImageRequest
{
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    [Required]
    public Guid MasterJobId { get; init; }

    [Required]
    public Guid MasterJobImageId { get; init; }
}
