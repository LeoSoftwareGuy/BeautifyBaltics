using System.ComponentModel.DataAnnotations;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterJobImage;

public record DeleteMasterJobImageRequest
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
    /// Master job image identifier
    /// </summary>
    [Required]
    public Guid MasterJobImageId { get; init; }
}
