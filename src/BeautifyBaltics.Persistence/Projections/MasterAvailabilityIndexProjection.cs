using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using Marten;
using Marten.Events.Projections;

namespace BeautifyBaltics.Persistence.Projections;

public record MasterAvailabilityIndex(Guid Id, Guid MasterId) : Projection
{
    public string MasterName { get; init; } = string.Empty;
    public DateTime StartAt { get; init; }
    public DateTime EndAt { get; init; }
    public AvailabilitySlotType SlotType { get; init; } = AvailabilitySlotType.Available;
}

public class MasterAvailabilityIndexProjection : MultiStreamProjection<MasterAvailabilityIndex, Guid>
{
    public MasterAvailabilityIndexProjection()
    {
        Identity<MasterAvailabilitySlotCreated>(e => e.MasterAvailabilityId);
        Identity<MasterAvailabilitySlotUpdated>(e => e.MasterAvailabilityId);
        Identity<MasterAvailabilitySlotDeleted>(e => e.MasterAvailabilitySlotId);

        DeleteEvent<MasterAvailabilitySlotDeleted>();
    }

    public static async Task<MasterAvailabilityIndex> Create(
        MasterAvailabilitySlotCreated @event,
        IQuerySession session,
        CancellationToken cancellationToken
    )
    {
        var master = await session.LoadAsync<Master>(@event.MasterId, cancellationToken);
        return new(@event.MasterAvailabilityId, @event.MasterId)
        {
            MasterName = master?.FirstName ?? string.Empty,
            StartAt = @event.StartAt,
            EndAt = @event.EndAt,
            SlotType = @event.SlotType,
        };
    }

    public static MasterAvailabilityIndex Apply(MasterAvailabilitySlotUpdated @event, MasterAvailabilityIndex current) =>
        current with { StartAt = @event.StartAt, EndAt = @event.EndAt };
}
