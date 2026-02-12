using System.ComponentModel.DataAnnotations;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SetMasterJobFeaturedImage;

public record SetMasterJobFeaturedImageRequest
{
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    [Required]
    public Guid MasterJobId { get; init; }

    public Guid? MasterJobImageId { get; init; }
}
