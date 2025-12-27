using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DefineAvailability;

public class CreateMasterAvailabilityEventHandler
{
    [AggregateHandler]
    public Task<(Events, OutgoingMessages)> Handle(CreateMasterAvailabilityRequest request, MasterAggregate master, CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var events = new Events();

        foreach (var availability in request.Availability)
        {
            events.Add(new MasterAvailabilitySlotCreated(request.MasterId, availability.Start, availability.End));
        }

        return Task.FromResult<(Events, OutgoingMessages)>((events, [new CreateMasterAvailabilityResponse(request.MasterId)]));
    }
}
