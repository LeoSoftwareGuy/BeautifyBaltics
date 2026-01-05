using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Job;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Job.Commands.UpdateJob
{
    public class UpdateJobEventHandler(IJobRepository jobRepository, IJobCategoryRepository jobCategoryRepository, IDocumentSession documentSession)
    {
        public async Task<UpdateJobResponse> Handle(UpdateJobRequest request, CancellationToken cancellationToken)
        {
            var job = await jobRepository.GetByIdAsync(request.JobId, cancellationToken) ??
                throw NotFoundException.For<Domain.Documents.Job>(request.JobId);

            var category = await jobCategoryRepository.GetByIdAsync(request.CategoryId, cancellationToken)
                ?? throw NotFoundException.For<Domain.Documents.JobCategory>(request.CategoryId);

            job.Update(
                name: request.Name,
                categoryId: category.Id,
                categoryName: category.Name,
                duration: TimeSpan.FromMinutes(request.DurationMinutes),
                description: request.Description
            );

            documentSession.Update(job);

            return new UpdateJobResponse(job.Id);
        }
    }
}
