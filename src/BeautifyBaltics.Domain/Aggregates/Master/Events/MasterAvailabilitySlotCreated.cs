using BeautifyBaltics.Domain.Enumerations;
using JasperFx.Core;

namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterAvailabilitySlotCreated(
    Guid MasterId,
    DateTime StartAt,
    DateTime EndAt,
    AvailabilitySlotType SlotType = AvailabilitySlotType.Available
)
{
    public Guid MasterAvailabilityId { get; init; } = CombGuidIdGeneration.NewGuid();
}
