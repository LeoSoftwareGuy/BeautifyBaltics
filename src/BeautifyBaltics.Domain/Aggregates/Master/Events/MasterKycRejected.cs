namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterKycRejected(
    Guid MasterId,
    Guid RejectedById,
    string Reason,
    DateTimeOffset RejectedAt
);
