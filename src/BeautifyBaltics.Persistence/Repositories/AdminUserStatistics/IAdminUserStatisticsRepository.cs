using AdminUserStats = BeautifyBaltics.Persistence.Projections.AdminUserStatistics;
using BeautifyBaltics.Persistence.Repositories.SeedWork;
using BeautifyBaltics.Persistence.Repositories.User.DTOs;

namespace BeautifyBaltics.Persistence.Repositories.AdminUserStatistics;

public interface IAdminUserStatisticsRepository : IQueryRepository<AdminUserStats, UserSearchDTO>
{
    Task<IReadOnlyList<AdminUserStats>> GetByUserIdsAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken = default);
}
