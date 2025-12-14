using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterAvailabilityDefined(
    Guid MasterId,
    IReadOnlyCollection<AvailabilitySlot> Slots
);
