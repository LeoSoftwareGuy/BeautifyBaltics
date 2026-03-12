using BeautifyBaltics.Domain.SeedWork.Approvable.Events;

namespace BeautifyBaltics.Domain.SeedWork.Approvable;

public abstract class ApprovableAggregate : Aggregate
{
    private readonly Dictionary<Guid, string> _pendingChangesets = [];

    public IReadOnlyDictionary<Guid, string> PendingChangesets => _pendingChangesets;
    public bool HasPendingChangesets => _pendingChangesets.Count > 0;

    protected void ApplyChangeProposed(ChangeProposed @event)
    {
        _pendingChangesets[@event.ChangesetId] = @event.Type;
    }

    protected void ApplyChangesetApproved(ChangesetApproved @event)
    {
        _pendingChangesets.Remove(@event.ChangesetId);
    }

    protected void ApplyChangesetRejected(ChangesetRejected @event)
    {
        _pendingChangesets.Remove(@event.ChangesetId);
    }
}
