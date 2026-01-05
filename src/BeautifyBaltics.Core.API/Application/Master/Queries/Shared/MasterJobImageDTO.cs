namespace BeautifyBaltics.Core.API.Application.Master.Queries.Shared;

public record MasterJobImageDTO
{
    public Guid Id { get; init; }
    public required string FileName { get; init; }
    public required string FileMimeType { get; init; }
    public long FileSize { get; init; }
}
