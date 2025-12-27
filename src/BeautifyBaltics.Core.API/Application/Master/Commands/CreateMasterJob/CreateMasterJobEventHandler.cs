using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.AddMasterJob;

public class CreateMasterJobEventHandler
{
    [AggregateHandler]
    public Task<(Events, OutgoingMessages)> Handle(CreateMasterJobRequest request, MasterAggregate master, CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var @event = new MasterJobCreated(
            request.MasterId,
            request.Job.JobId,
            request.Job.Price,
            TimeSpan.FromMinutes(request.Job.DurationMinutes),
            request.Job.Title
        );

        return Task.FromResult<(Events, OutgoingMessages)>(([ @event ], [ new CreateMasterJobResponse(request.MasterId, @event.MasterJobId) ]));
    }
}
