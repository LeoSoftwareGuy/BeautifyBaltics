namespace BeautifyBaltics.Domain.Aggregates.Master.Changesets;

public record MasterJobUpdateChangeProposed(
    Guid MasterJobId,
    Guid JobId,
    decimal Price,
    TimeSpan Duration,
    string Title,
    Guid JobCategoryId,
    string JobCategoryName,
    string JobName
);
