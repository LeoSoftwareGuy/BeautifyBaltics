using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using JasperFx.Events;
using Marten;
using Marten.Events.Aggregation;

namespace BeautifyBaltics.Persistence.Projections
{

    public record MasterAvailabilitySlot(Guid Id, Guid MasterId) : Projection
    {
        public DateTime StartAt { get; init; }

        public required string MasterName { get; init; }

        public DateTime EndAt { get; init; }
    }

    public class MasterAvailabilitySlotProjection : SingleStreamProjection<MasterAvailabilitySlot, Guid>
    {
        public MasterAvailabilitySlotProjection()
        {
            DeleteEvent<MasterAvailabilitySlotDeleted>();
        }

        public static async Task<MasterAvailabilitySlot> Create(IEvent<MasterAvailabilitySlotCreated> @event, IQuerySession session,
        CancellationToken cancellationToken)
        {
            var master = await session.LoadAsync<Master>(@event.Data.MasterId, cancellationToken);
            if (master == null) throw new InvalidOperationException($"Master with ID'{@event.Data.MasterId}' not found.");

            return new MasterAvailabilitySlot(@event.Data.MasterAvailabilityId, @event.Data.MasterId)
            {
                MasterName = master.FirstName,
                StartAt = @event.Data.StartAt,
                EndAt = @event.Data.EndAt,
            };
        }
    }
}
