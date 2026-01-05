using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Job.DTOs;

public record JobCategorySearchDTO : BaseSearchDTO
{
    public string? Name { get; init; }
}
