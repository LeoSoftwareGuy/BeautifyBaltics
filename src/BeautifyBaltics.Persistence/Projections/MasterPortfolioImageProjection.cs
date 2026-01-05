using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using JasperFx.Events;
using Marten.Events.Aggregation;

namespace BeautifyBaltics.Persistence.Projections;

public record MasterPortfolioImage(Guid MasterId, Guid MasterPortfolioImageId) : FileProjection
{
    public Guid Id { get; init; } = MasterPortfolioImageId;
}

public class MasterPortfolioImageProjection : SingleStreamProjection<MasterPortfolioImage, Guid>
{
    public static MasterPortfolioImage Create(IEvent<MasterPortfolioImageUploaded> @event)
    {
        return new MasterPortfolioImage(@event.Data.MasterId, @event.Data.MasterPortfolioImageId)
        {
            Id = @event.Data.MasterPortfolioImageId,
            BlobName = @event.Data.BlobName,
            FileName = @event.Data.FileName,
            FileMimeType = @event.Data.FileMimeType,
            FileSize = @event.Data.FileSize
        };
    }
}
