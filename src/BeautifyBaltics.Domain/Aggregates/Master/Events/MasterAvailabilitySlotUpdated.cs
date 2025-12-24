namespace BeautifyBaltics.Domain.Aggregates.Master.Events
{
    public record MasterAvailabilitySlotUpdated(
          Guid MasterAvailabilityId,
          Guid MasterId,
          DateTime StartAt,
          DateTime EndAt
    );
}
