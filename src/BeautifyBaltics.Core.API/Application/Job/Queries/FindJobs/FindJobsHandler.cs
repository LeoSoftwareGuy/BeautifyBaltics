using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Repositories.Job;
using BeautifyBaltics.Persistence.Repositories.Job.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Job.Queries.FindJobs;

public class FindJobsHandler(IJobRepository repository)
{
    public async Task<PagedResponse<FindJobsResponse>> Handle(FindJobsRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<JobSearchDTO>();
        var result = await repository.GetPagedListAsync(search, cancellationToken);
        return result.ToPagedResponse<Domain.Documents.Job, FindJobsResponse>();
    }
}
