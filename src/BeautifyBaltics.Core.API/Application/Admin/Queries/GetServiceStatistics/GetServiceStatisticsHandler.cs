using BeautifyBaltics.Persistence.Repositories.Job;
using BeautifyBaltics.Persistence.Repositories.Job.DTOs;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetServiceStatistics;

public class GetServiceStatisticsHandler(IJobRepository jobRepository, IJobCategoryRepository categoryRepository)
{
    public async Task<GetServiceStatisticsResponse> Handle(GetServiceStatisticsRequest request, CancellationToken cancellationToken)
    {
        var totalServicesTask = jobRepository.CountAsync(new JobSearchDTO(), cancellationToken);
        var totalCategoriesTask = categoryRepository.CountAsync(new JobCategorySearchDTO(), cancellationToken);

        await Task.WhenAll(totalServicesTask, totalCategoriesTask);

        var avgPrice = await jobRepository.AveragePriceAsync(cancellationToken);

        return new GetServiceStatisticsResponse
        {
            TotalServices = await totalServicesTask,
            TotalCategories = await totalCategoriesTask,
            AveragePrice = avgPrice,
        };
    }
}
