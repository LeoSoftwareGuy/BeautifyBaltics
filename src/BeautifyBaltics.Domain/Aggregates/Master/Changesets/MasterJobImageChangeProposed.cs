namespace BeautifyBaltics.Domain.Aggregates.Master.Changesets;

public record MasterJobImageChangeProposed(
    Guid MasterJobImageId,
    Guid MasterJobId,
    string BlobName,
    string FileName,
    string FileMimeType,
    long FileSize
);
