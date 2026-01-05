using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Job;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Job.Commands.CreateJob;

public class CreateJobEventHandler(ICommandRepository commandRepository, IJobCategoryRepository jobCategoryRepository)
{
    public async Task<CreateJobResponse> Handle(CreateJobRequest request, CancellationToken cancellationToken)
    {
        var category = await jobCategoryRepository.GetByIdAsync(request.CategoryId, cancellationToken)
            ?? throw NotFoundException.For<Domain.Documents.JobCategory>(request.CategoryId);

        var job = commandRepository.Insert(new Domain.Documents.Job(
            Guid.NewGuid(),
            request.Name,
            category.Id,
            category.Name,
            TimeSpan.FromMinutes(request.DurationMinutes),
            request.Description
        ));

        return new CreateJobResponse(job.Id);
    }
}
