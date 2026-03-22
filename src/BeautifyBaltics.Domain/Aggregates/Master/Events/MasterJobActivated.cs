namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterJobActivated(Guid MasterId, Guid MasterJobId);
