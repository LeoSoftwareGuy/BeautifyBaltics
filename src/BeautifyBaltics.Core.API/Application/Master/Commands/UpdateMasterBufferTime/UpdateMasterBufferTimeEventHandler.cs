using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterBufferTime;

public class UpdateMasterBufferTimeEventHandler
{
    [AggregateHandler]
    public Task<(Events, OutgoingMessages)> Handle(UpdateMasterBufferTimeRequest request, MasterAggregate master, CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var events = new Events
        {
            new MasterBufferTimeUpdated(request.MasterId, request.BufferMinutes)
        };

        return Task.FromResult<(Events, OutgoingMessages)>((events, [new UpdateMasterBufferTimeResponse(request.MasterId)]));
    }
}
