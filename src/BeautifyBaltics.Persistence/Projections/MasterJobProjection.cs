using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using JasperFx.Events;
using Marten.Events.Aggregation;

namespace BeautifyBaltics.Persistence.Projections;

public record MasterJobImage(Guid Id, Guid MasterJobId, string FileName, string FileMimeType, long FileSize, string BlobName);

public record MasterJob(Guid Id, Guid MasterId) : Projection
{
    public Guid JobId { get; init; }
    public string JobName { get; init; } = string.Empty;
    public Guid JobCategoryId { get; init; }
    public string JobCategoryName { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public TimeSpan Duration { get; init; }
    public IReadOnlyCollection<MasterJobImage> Images { get; init; } = [];
}

public class MasterJobProjection : SingleStreamProjection<MasterJob, Guid>
{
    public MasterJobProjection()
    {
        DeleteEvent<MasterJobDeleted>();
    }

    public static MasterJob Create(IEvent<MasterJobCreated> @event)
    {
        return new MasterJob(@event.StreamId, @event.Data.MasterId)
        {
            JobId = @event.Data.JobId,
            JobName = @event.Data.JobName,
            JobCategoryId = @event.Data.JobCategoryId,
            JobCategoryName = @event.Data.JobCategoryName,
            Title = @event.Data.Title,
            Price = @event.Data.Price,
            Duration = @event.Data.Duration
        };
    }

    public static MasterJob Apply(MasterJobUpdated @event, MasterJob current) =>
        current with
        {
            MasterId = @event.MasterId,
            JobId = @event.JobId,
            JobName = @event.JobName,
            JobCategoryId = @event.JobCategoryId,
            JobCategoryName = @event.JobCategoryName,
            Title = @event.Title,
            Price = @event.Price,
            Duration = @event.Duration
        };

    public static MasterJob Apply(MasterJobImageUploaded @event, MasterJob current)
    {
        var images = current.Images?.ToList() ?? [];

        images.RemoveAll(i => i.Id == @event.MasterJobImageId);

        images.Add(new MasterJobImage(
            @event.MasterJobImageId,
            @event.MasterJobId,
            @event.FileName,
            @event.FileMimeType,
            @event.FileSize,
            @event.BlobName)
        );

        return current with { Images = images };
    }
}
