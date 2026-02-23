using BeautifyBaltics.Persistence.Repositories.Client.DTOs;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Client;

public interface IClientRepository : IQueryRepository<Projections.Client, ClientSearchDTO>
{
    Task<Projections.Client?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}
