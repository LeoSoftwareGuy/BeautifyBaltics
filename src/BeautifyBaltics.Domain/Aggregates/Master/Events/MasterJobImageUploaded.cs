using BeautifyBaltics.Domain.Aggregates.SeedWork.Files.Events;
using JasperFx.Core;

namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterJobImageUploaded(
    Guid MasterId,
    Guid MasterJobId,
    string BlobName,
    string FileName,
    string FileMimeType,
    long FileSize
) : IFileCreatedEvent
{
    public Guid MasterJobImageId { get; init; } = CombGuidIdGeneration.NewGuid();
}
