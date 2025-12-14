using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.ValueObjects;

public class AvailabilitySlot : ValueObject
{
    public AvailabilitySlot(DateTime start, DateTime end)
    {
        if (end <= start) throw new ArgumentException("End must be after start", nameof(end));
        Start = start;
        End = end;
    }

    public DateTime Start { get; }
    public DateTime End { get; }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Start;
        yield return End;
    }
}
