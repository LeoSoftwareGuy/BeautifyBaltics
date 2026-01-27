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
        var now = DateTime.UtcNow;
        var earliestAllowedStart = now.AddHours(3);

        foreach (var availability in request.Availability)
        {
            if (availability.End <= availability.Start)
            {
                throw DomainException.WithMessage("Availability slot end time must be after the start time.");
            }

            if (DateTime.SpecifyKind(availability.Start, DateTimeKind.Utc) < earliestAllowedStart)
            {
                throw DomainException.WithMessage("Availability slots must start at least 3 hours from now.");
            }

            if (master.HasOverlappingAvailability(availability.Start, availability.End))
            {
                throw DomainException.WithMessage(
                    $"Time slot {availability.Start:HH:mm} - {availability.End:HH:mm} overlaps with an existing availability slot.");
            }

            events.Add(new MasterAvailabilitySlotCreated(request.MasterId, availability.Start, availability.End));
        }

        return Task.FromResult<(Events, OutgoingMessages)>((events, [new CreateMasterAvailabilityResponse(request.MasterId)]));
    }
}
