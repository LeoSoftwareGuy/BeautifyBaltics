namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterJobSubmittedForReview(Guid MasterId, Guid MasterJobId);
