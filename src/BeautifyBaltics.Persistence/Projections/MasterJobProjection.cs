using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using Marten.Events.Projections;

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
    public Guid? FeaturedImageId { get; init; }
    public IReadOnlyCollection<MasterJobImage> Images { get; init; } = [];
}

public class MasterJobProjection : MultiStreamProjection<MasterJob, Guid>
{
    public MasterJobProjection()
    {
        Identity<MasterJobCreated>(e => e.MasterJobId);
        Identity<MasterJobUpdated>(e => e.MasterJobId);
        Identity<MasterJobDeleted>(e => e.MasterJobId);
        Identity<MasterJobImageUploaded>(e => e.MasterJobId);
        Identity<MasterJobImageDeleted>(e => e.MasterJobId);
        Identity<MasterJobFeaturedImageSet>(e => e.MasterJobId);

        DeleteEvent<MasterJobDeleted>();
    }

    public static MasterJob Create(MasterJobCreated @event)
    {
        return new MasterJob(@event.MasterJobId, @event.MasterId)
        {
            JobId = @event.JobId,
            JobName = @event.JobName,
            JobCategoryId = @event.JobCategoryId,
            JobCategoryName = @event.JobCategoryName,
            Title = @event.Title,
            Price = @event.Price,
            Duration = @event.Duration
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

    public static MasterJob Apply(MasterJobImageDeleted @event, MasterJob current)
    {
        var images = current.Images?.ToList() ?? [];

        images.RemoveAll(i => i.Id == @event.MasterJobImageId);

        return current with
        {
            Images = images,
            FeaturedImageId = current.FeaturedImageId == @event.MasterJobImageId ? null : current.FeaturedImageId
        };
    }

    public static MasterJob Apply(MasterJobFeaturedImageSet @event, MasterJob current) =>
        current with { FeaturedImageId = @event.FeaturedImageId };
}
