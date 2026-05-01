namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterKycSubmitted(
    Guid MasterId,
    string BlobName,
    string FileName,
    string FileMimeType,
    long FileSize,
    DateTimeOffset SubmittedAt
);
