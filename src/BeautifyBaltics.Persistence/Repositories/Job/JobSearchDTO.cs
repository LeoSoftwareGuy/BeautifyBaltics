using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Job;

public record JobSearchDTO : BaseSearchDTO
{
    public string? Text { get; init; }
}
