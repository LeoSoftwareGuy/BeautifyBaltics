namespace BeautifyBaltics.Domain.Aggregates.SeedWork.Files;

public abstract class FileEntity(
    string blobName,
    string fileName,
    string fileMimeType,
    long fileSize
)
{
    public string BlobName { get; } = blobName.Trim();
    public string FileName { get; } = fileName.Trim();
    public string FileMimeType { get; } = fileMimeType.Trim();
    public long FileSize { get; } = fileSize;
}
