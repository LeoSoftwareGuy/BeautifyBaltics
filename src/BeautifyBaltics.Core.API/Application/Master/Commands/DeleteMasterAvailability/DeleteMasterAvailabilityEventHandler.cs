using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;
using static BeautifyBaltics.Domain.Aggregates.Master.MasterAggregate;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterAvailability;

public class DeleteMasterAvailabilityEventHandler
{
    [AggregateHandler]
    public (Events, OutgoingMessages) Handle(DeleteMasterAvailabilityRequest request, MasterAggregate master)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var availability = master.Availabilities.FirstOrDefault(a => a.Id == request.MasterAvailabilityId)
            ?? throw NotFoundException.For<MasterAvailabilitySlot>(request.MasterAvailabilityId);

        var @event = new MasterAvailabilitySlotDeleted(request.MasterId, request.MasterAvailabilityId);

        return ([@event], [new DeleteMasterAvailabilityResponse(request.MasterId, request.MasterAvailabilityId)]);
    }
}
