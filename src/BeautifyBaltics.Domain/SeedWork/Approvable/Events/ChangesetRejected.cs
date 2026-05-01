namespace BeautifyBaltics.Domain.SeedWork.Approvable.Events;

public abstract record ChangesetRejected
{
    public Guid AggregateId { get; init; }
    public Guid ChangesetId { get; init; }
    public Guid RejectedById { get; init; }
    public string? Comment { get; init; }
    public DateTimeOffset RejectedAt { get; init; } = DateTimeOffset.UtcNow;
}
