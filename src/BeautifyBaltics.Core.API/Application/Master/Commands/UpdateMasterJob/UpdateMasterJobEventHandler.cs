using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Job;
using Wolverine;
using Wolverine.Marten;
using static BeautifyBaltics.Domain.Aggregates.Master.MasterAggregate;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterJob;

public class UpdateMasterJobEventHandler(IJobRepository jobRepository)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(UpdateMasterJobRequest request, MasterAggregate master, CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var job = master.Jobs.SingleOrDefault(j => j.MasterJobId == request.MasterJobId)
            ?? throw NotFoundException.For<MasterJob>(request.MasterJobId);

        var jobDefinition = await jobRepository.GetByIdAsync(request.Job.JobId, cancellationToken)
                            ?? throw NotFoundException.For<Domain.Documents.Job>(request.Job.JobId);

        var @event = new MasterJobUpdated(
            MasterJobId: request.MasterJobId,
            MasterId: request.MasterId,
            JobId: request.Job.JobId,
            Price: request.Job.Price,
            Duration: TimeSpan.FromMinutes(request.Job.DurationMinutes),
            Title: request.Job.Title,
            JobCategoryId: jobDefinition.CategoryId,
            JobCategoryName: jobDefinition.CategoryName,
            JobName: jobDefinition.Name
        );

        return ([@event], [new UpdateMasterJobResponse(request.MasterId, request.MasterJobId)]);
    }
}
