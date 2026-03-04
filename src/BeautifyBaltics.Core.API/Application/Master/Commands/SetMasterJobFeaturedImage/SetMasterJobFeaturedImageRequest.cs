using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SetMasterJobFeaturedImage;

public record SetMasterJobFeaturedImageRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Master job identifier
    /// </summary>
    [Required]
    public Guid MasterJobId { get; init; }

    /// <summary>
    /// Master job image identfier to be set as featured
    /// </summary>
    public Guid? MasterJobImageId { get; init; }

    /// <summary>
    /// Featured image horizontal adjustment
    /// </summary>
    public double? FocusX { get; init; }

    /// <summary>
    /// Featured image vertical adjustment
    /// </summary>
    public double? FocusY { get; init; }

    /// <summary>
    /// Featured image zoom adjustment
    /// </summary>
    public double? Zoom { get; init; }
}
