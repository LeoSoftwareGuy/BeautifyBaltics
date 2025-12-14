using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Client;

public record ClientSearchDTO : BaseSearchDTO
{
    public string? Text { get; init; }
}
