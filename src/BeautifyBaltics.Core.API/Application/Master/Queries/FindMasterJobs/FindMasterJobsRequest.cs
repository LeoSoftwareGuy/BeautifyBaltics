using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterJobs;

public record FindMasterJobsRequest
{
    [Required]
    [Identity]
    public Guid MasterId { get; init; }
}
