using BeautifyBaltics.Core.API.Application.Job.Queries.FindJobCategories;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Repositories.Job;
using BeautifyBaltics.Persistence.Repositories.Job.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Job.Queries.GetJobCategories;

public class FindJobCategoriesHandler(IJobCategoryRepository repository)
{
    public async Task<PagedResponse<FindJobCategoriesResponse>> Handle(FindJobCategoriesRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<JobCategorySearchDTO>();
        var result = await repository.GetPagedListAsync(search, cancellationToken);
        return result.ToPagedResponse<Domain.Documents.JobCategory, FindJobCategoriesResponse>();
    }
}
