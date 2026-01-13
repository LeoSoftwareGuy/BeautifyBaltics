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

        var job = master.Jobs.FirstOrDefault(j => j.MasterJobId == request.MasterJobId)
            ?? throw NotFoundException.For<MasterJob>(request.MasterJobId);

        var jobDefinition = await jobRepository.GetByIdAsync(request.Job.JobId, cancellationToken)
                            ?? throw NotFoundException.For<Domain.Documents.Job>(request.Job.JobId);

        var @event = new MasterJobUpdated(
            request.MasterJobId,
            request.MasterId,
            request.Job.JobId,
            request.Job.Price,
            TimeSpan.FromMinutes(request.Job.DurationMinutes),
            request.Job.Title,
            jobDefinition.CategoryId,
            jobDefinition.CategoryName,
            jobDefinition.Name
        );

        return ([@event], [new UpdateMasterJobResponse(request.MasterId, request.MasterJobId)]);
    }
}
