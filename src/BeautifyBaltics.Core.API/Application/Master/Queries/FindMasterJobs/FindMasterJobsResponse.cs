using BeautifyBaltics.Core.API.Application.Master.Queries.Shared;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterJobs;

public record FindMasterJobsResponse
{
    public IEnumerable<MasterJobDTO> Jobs { get; init; } = [];
}
