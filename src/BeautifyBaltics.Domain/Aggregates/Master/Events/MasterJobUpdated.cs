namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterJobUpdated(
    Guid MasterJobId,
    Guid MasterId,
    Guid JobId,
    decimal Price,
    TimeSpan Duration,
    string Title
);