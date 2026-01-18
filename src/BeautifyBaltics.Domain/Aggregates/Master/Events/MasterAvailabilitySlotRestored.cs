namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterAvailabilitySlotRestored(Guid MasterId, Guid MasterAvailabilitySlotId, Guid BookingId);
