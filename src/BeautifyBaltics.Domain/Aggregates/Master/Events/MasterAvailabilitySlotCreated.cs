using JasperFx.Core;

namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterAvailabilitySlotCreated(
    Guid MasterId,
    DateTime StartAt,
    DateTime EndAt
)
{
    public Guid MasterAvailabilityId { get; init; } = CombGuidIdGeneration.NewGuid();
}
