using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Master.DTOs;

public record MasterJobSearchDTO : BaseSearchDTO
{
    public Guid? MasterId { get; init; }
    public Guid? MasterJobId { get; init; }
}
