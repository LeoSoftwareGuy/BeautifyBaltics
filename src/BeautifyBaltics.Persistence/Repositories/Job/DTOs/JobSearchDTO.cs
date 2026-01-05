using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Job.DTOs;

public record JobSearchDTO : BaseSearchDTO
{
    public string? Name { get; init; }
    public Guid? CategoryId { get; init; }
}
