namespace BeautifyBaltics.Core.API.Application.Job.Queries.Shared;

public record JobCategoryDTO
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
}
