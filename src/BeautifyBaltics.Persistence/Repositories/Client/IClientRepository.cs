using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Client;

public interface IClientRepository : IQueryRepository<Projections.Client, ClientSearchDTO>
{
    Task<Projections.Client?> GetBySupabaseUserIdAsync(string supabaseUserId, CancellationToken cancellationToken = default);
}
