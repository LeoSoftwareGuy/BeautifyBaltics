namespace BeautifyBaltics.Domain.Aggregates.Master.Events
{
    public record MasterAvailabilitySlotDeleted(Guid MasterId, Guid MasterAvailabilitySlotId);
}
