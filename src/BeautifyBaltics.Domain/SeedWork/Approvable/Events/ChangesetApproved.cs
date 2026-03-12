namespace BeautifyBaltics.Domain.SeedWork.Approvable.Events;

public abstract record ChangesetApproved
{
    public Guid AggregateId { get; init; }
    public Guid ChangesetId { get; init; }
    public Guid ApprovedById { get; init; }
    public string? Comment { get; init; }
    public DateTimeOffset ApprovedAt { get; init; } = DateTimeOffset.UtcNow;
}
