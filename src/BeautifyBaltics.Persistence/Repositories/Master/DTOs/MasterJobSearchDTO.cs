using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Master.DTOs;

public record MasterJobSearchDTO : BaseSearchDTO
{
    public Guid? MasterJobId { get; init; }
}