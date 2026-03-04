using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterJob;

public record DeleteMasterJobRequest
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
}
