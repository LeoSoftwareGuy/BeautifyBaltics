namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterKycSessionAbandoned(
    Guid MasterId,
    string SessionId,
    DateTimeOffset AbandonedAt
);
