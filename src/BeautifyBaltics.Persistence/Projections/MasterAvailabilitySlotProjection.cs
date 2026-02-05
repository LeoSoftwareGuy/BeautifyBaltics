using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using Marten;
using Marten.Events.Projections;

namespace BeautifyBaltics.Persistence.Projections
{
    public record MasterAvailabilitySlot(Guid Id, Guid MasterId) : Projection
    {
        public DateTime StartAt { get; init; }

        public required string MasterName { get; init; }

        public DateTime EndAt { get; init; }
    }

    public class MasterAvailabilitySlotProjection : MultiStreamProjection<MasterAvailabilitySlot, Guid>
    {
        public MasterAvailabilitySlotProjection()
        {
            Identity<MasterAvailabilitySlotCreated>(e => e.MasterAvailabilityId);
            Identity<MasterAvailabilitySlotUpdated>(e => e.MasterAvailabilityId);
            Identity<MasterAvailabilitySlotDeleted>(e => e.MasterAvailabilitySlotId);

            DeleteEvent<MasterAvailabilitySlotDeleted>();
        }

        public static async Task<MasterAvailabilitySlot> Create(MasterAvailabilitySlotCreated @event, IQuerySession session,
           CancellationToken cancellationToken
        )
        {
            var master = await session.LoadAsync<Master>(@event.MasterId, cancellationToken)
                ?? throw new InvalidOperationException($"Master with ID'{@event.MasterId}' not found.");

            return new MasterAvailabilitySlot(@event.MasterAvailabilityId, @event.MasterId)
            {
                MasterName = master.FirstName,
                StartAt = @event.StartAt,
                EndAt = @event.EndAt,
            };
        }

        public static MasterAvailabilitySlot Apply(MasterAvailabilitySlotUpdated @event, MasterAvailabilitySlot current) =>
            current with
            {
                StartAt = @event.StartAt,
                EndAt = @event.EndAt,
            };
    }
}
