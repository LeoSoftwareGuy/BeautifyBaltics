using BeautifyBaltics.Domain.Aggregates.SeedWork.Files.Events;
using JasperFx.Core;

namespace BeautifyBaltics.Domain.Aggregates.Client.Events;

public record ClientProfileImageUploaded(
    Guid ClientId,
    string BlobName,
    string FileName,
    string FileMimeType,
    long FileSize
) : IFileCreatedEvent
{
    public Guid ClientProfileImageId { get; init; } = CombGuidIdGeneration.NewGuid();
}
