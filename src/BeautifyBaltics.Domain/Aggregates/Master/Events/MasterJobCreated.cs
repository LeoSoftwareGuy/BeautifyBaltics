using JasperFx.Core;

namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterJobCreated(
    Guid MasterId,
    Guid JobId,
    decimal Price,
    TimeSpan Duration,
    string Title
)
{
    public Guid MasterJobId { get; init; } = CombGuidIdGeneration.NewGuid();
}