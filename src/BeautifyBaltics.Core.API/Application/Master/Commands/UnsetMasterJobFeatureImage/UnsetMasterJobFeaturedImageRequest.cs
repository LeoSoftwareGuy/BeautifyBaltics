using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UnsetMasterJobFeatureImage;

public record UnsetMasterJobFeaturedImageRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Master job identifer
    /// </summary>
    [Required]
    public Guid MasterJobId { get; init; }
}
