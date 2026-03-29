namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterKycApproved(
    Guid MasterId,
    Guid ApprovedById,
    DateTimeOffset ApprovedAt
);
