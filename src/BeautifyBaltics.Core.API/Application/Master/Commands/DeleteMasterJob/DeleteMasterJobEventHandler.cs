using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;
using static BeautifyBaltics.Domain.Aggregates.Master.MasterAggregate;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterJob;

public class DeleteMasterJobEventHandler
{
    [AggregateHandler]
    public (Events, OutgoingMessages) Handle(DeleteMasterJobRequest request, MasterAggregate master)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var job = master.Jobs.FirstOrDefault(j => j.MasterJobId == request.MasterJobId)
            ?? throw NotFoundException.For<MasterJob>(request.MasterJobId);

        var @event = new MasterJobDeleted(request.MasterId, request.MasterJobId);

        return ([@event], [new DeleteMasterJobResponse(request.MasterId, request.MasterJobId)]);
    }
}
