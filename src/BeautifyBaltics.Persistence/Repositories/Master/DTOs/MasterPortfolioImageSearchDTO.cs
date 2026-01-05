using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Master.DTOs;

public record MasterPortfolioImageSearchDTO : BaseSearchDTO
{
    public Guid? MasterId { get; init; }
}
