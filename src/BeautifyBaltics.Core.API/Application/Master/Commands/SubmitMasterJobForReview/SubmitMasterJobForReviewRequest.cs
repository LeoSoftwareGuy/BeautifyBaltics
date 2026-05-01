using System.ComponentModel.DataAnnotations;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SubmitMasterJobForReview;

public record SubmitMasterJobForReviewRequest
{
    /// <summary>
    /// Master id
    /// </summary>
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Master job id
    /// </summary>
    [Required]
    public Guid MasterJobId { get; init; }
}
