using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Job;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Job.Commands.UpdateJob
{
    public class UpdateJobEventHandler(IJobRepository jobRepository, IDocumentSession documentSession)
    {
        public async Task<UpdateJobResponse> Handle(UpdateJobRequest request, CancellationToken cancellationToken)
        {
            var job = await jobRepository.GetByIdAsync(request.JobId, cancellationToken) ??
                throw NotFoundException.For<Domain.Documents.Job>(request.JobId);

            job.Update(
                name: request.Name,
                category: request.Category,
                duration: TimeSpan.FromMinutes(request.DurationMinutes),
                description: request.Description,
                images: request.Images
            );

            documentSession.Update(job);

            return new UpdateJobResponse(job.Id);
        }
    }
}
