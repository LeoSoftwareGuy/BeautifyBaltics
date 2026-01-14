using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;
using static BeautifyBaltics.Domain.Aggregates.Master.MasterAggregate;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterAvailability;

public class UpdateMasterAvailabilityEventHandler
{
    [AggregateHandler]
    public (Events, OutgoingMessages) Handle(UpdateMasterAvailabilityRequest request, MasterAggregate master)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var availability = master.Availabilities.SingleOrDefault(a => a.Id == request.MasterAvailabilityId)
            ?? throw NotFoundException.For<MasterAvailabilitySlot>(request.MasterAvailabilityId);

        var @event = new MasterAvailabilitySlotUpdated(
            MasterAvailabilityId: availability.Id,
            MasterId: master.Id,
            StartAt: request.Availability.Start,
            EndAt: request.Availability.End
        );

        return ([@event], [new UpdateMasterAvailabilityResponse(request.MasterId, request.MasterAvailabilityId)]);
    }
}
