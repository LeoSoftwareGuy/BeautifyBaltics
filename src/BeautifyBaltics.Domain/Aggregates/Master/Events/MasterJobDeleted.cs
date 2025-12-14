namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterJobDeleted(Guid MasterId, Guid MasterJobId);