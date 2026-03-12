namespace BeautifyBaltics.Domain.Aggregates.Master.Changesets;

public record MasterProfileImageChangeProposed(
    Guid MasterProfileImageId,
    string BlobName,
    string FileName,
    string FileMimeType,
    long FileSize
);
