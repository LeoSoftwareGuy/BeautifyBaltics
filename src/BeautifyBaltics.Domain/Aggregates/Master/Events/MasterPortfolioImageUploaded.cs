using BeautifyBaltics.Domain.Aggregates.SeedWork.Files.Events;
using JasperFx.Core;

namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterPortfolioImageUploaded(
    Guid MasterId,
    string BlobName,
    string FileName,
    string FileMimeType,
    long FileSize
) : IFileCreatedEvent
{
    public Guid MasterPortfolioImageId { get; init; } = CombGuidIdGeneration.NewGuid();
}
