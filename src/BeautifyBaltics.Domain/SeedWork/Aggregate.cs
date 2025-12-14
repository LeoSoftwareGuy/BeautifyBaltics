namespace BeautifyBaltics.Domain.SeedWork;

/// <summary>
/// Base type for event sourced aggregates.
/// </summary>
public abstract class Aggregate
{
    public Guid Id { get; protected set; }
}
