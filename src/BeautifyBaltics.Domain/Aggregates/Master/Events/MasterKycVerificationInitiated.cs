namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterKycVerificationInitiated(
    Guid MasterId,
    string SessionId,
    string VerificationUrl,
    DateTimeOffset InitiatedAt
);
