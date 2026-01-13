namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterJobImageDeleted(
    Guid MasterId,
    Guid MasterJobId,
    Guid MasterJobImageId
);
