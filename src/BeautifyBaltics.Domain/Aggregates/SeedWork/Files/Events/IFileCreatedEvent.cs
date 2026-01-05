namespace BeautifyBaltics.Domain.Aggregates.SeedWork.Files.Events;

/// <summary>
/// Marker interface with shared metadata for file creation events.
/// </summary>
public interface IFileCreatedEvent
{
    string BlobName { get; init; }
    string FileName { get; init; }
    string FileMimeType { get; init; }
    long FileSize { get; init; }
}
