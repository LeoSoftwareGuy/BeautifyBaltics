using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Master;

public interface IMasterRepository : IQueryRepository<Projections.Master, MasterSearchDTO>
{
    Task<Projections.Master?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}
