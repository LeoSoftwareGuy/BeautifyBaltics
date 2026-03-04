using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SetMasterJobFeaturedImage;

public record SetMasterJobFeaturedImageRequest
{
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    [Required]
    public Guid MasterJobId { get; init; }

    public Guid? MasterJobImageId { get; init; }

    public double? FocusX { get; init; }

    public double? FocusY { get; init; }

    public double? Zoom { get; init; }
}
