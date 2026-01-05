using BeautifyBaltics.Core.API.Application.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Job.Queries.GetJobCategories;

public record FindJobCategoriesRequest : PagedRequest
{
    /// <summary>
    /// Filter by name
    /// </summary>
    public string? Name { get; init; }
}
