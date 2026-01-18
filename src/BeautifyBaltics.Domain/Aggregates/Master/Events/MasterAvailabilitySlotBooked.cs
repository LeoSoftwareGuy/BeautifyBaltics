namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterAvailabilitySlotBooked(Guid MasterId, Guid MasterAvailabilitySlotId, Guid BookingId);
