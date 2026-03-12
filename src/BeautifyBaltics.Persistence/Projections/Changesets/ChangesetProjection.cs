using BeautifyBaltics.Domain.Aggregates.Master.Events;
using JasperFx.Events;
using Marten.Events.Projections;

namespace BeautifyBaltics.Persistence.Projections.Changesets;

public class ChangesetProjection : MultiStreamProjection<Changeset, Guid>
{
    public ChangesetProjection()
    {
        Identity<MasterChangeProposed>(e => e.ChangesetId);
        Identity<MasterChangesetApproved>(e => e.ChangesetId);
        Identity<MasterChangesetRejected>(e => e.ChangesetId);
    }

    public static Changeset Create(IEvent<MasterChangeProposed> @event) =>
        new(@event.Data.ChangesetId)
        {
            MasterId = @event.Data.AggregateId,
            EntityId = @event.Data.EntityId,
            Type = @event.Data.Type,
            ProposedChange = @event.Data.ProposedChange,
            ProposedById = @event.Data.ProposedById,
            ProposedAt = @event.Timestamp,
            Status = ChangesetStatus.Pending,
        };

    public static Changeset Apply(MasterChangesetApproved @event, Changeset current) =>
        current with
        {
            Status = ChangesetStatus.Approved,
            ApprovedById = @event.ApprovedById,
            ApprovedAt = @event.ApprovedAt,
            Comment = @event.Comment,
        };

    public static Changeset Apply(MasterChangesetRejected @event, Changeset current) =>
        current with
        {
            Status = ChangesetStatus.Rejected,
            RejectedById = @event.RejectedById,
            RejectedAt = @event.RejectedAt,
            Comment = @event.Comment,
        };
}
