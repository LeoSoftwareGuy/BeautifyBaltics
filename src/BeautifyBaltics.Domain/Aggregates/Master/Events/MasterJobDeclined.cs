namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterJobDeclined(Guid MasterId, Guid MasterJobId);
