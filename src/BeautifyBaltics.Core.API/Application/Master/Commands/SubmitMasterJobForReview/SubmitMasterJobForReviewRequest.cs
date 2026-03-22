using System.ComponentModel.DataAnnotations;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SubmitMasterJobForReview;

public record SubmitMasterJobForReviewRequest
{
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    [Required]
    public Guid MasterJobId { get; init; }
}
