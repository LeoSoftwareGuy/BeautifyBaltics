namespace BeautifyBaltics.Persistence.Projections.SeedWork;

public record FileProjection : Projection
{
    public required string BlobName { get; init; }
    public required string FileName { get; init; }
    public required string FileMimeType { get; init; }
    public long FileSize { get; init; }
}
