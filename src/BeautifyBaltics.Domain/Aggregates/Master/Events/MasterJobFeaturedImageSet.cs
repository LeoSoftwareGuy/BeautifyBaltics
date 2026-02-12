namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterJobFeaturedImageSet(
    Guid MasterId,
    Guid MasterJobId,
    Guid? FeaturedImageId
);
