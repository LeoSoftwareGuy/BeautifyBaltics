using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Job;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterJob;

public class UpdateMasterJobEventHandler(IJobRepository jobRepository)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(UpdateMasterJobRequest request, MasterAggregate master, CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var job = master.GetJobOrThrow(request.MasterJobId);

        if (job.Status == MasterJobStatus.PendingReview)
        {
            throw DomainException.WithMessage("Cannot update a job while it is pending review.");
        }

        var jobDefinition = await jobRepository.GetByIdAsync(request.Job.JobId, cancellationToken)
                            ?? throw NotFoundException.For<Domain.Documents.Job>(request.Job.JobId);

        var updatedEvent = new MasterJobUpdated(
            MasterJobId: job.MasterJobId,
            MasterId: master.Id,
            JobId: request.Job.JobId,
            Price: request.Job.Price,
            Duration: TimeSpan.FromMinutes(request.Job.DurationMinutes),
            Title: request.Job.Title,
            JobCategoryId: jobDefinition.CategoryId,
            JobCategoryName: jobDefinition.CategoryName,
            JobName: jobDefinition.Name
        );

        return ([updatedEvent], [new UpdateMasterJobResponse(request.MasterId, request.MasterJobId)]);
    }
}
