using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.User
{
    public interface ISessionRepository : IQueryRepository<Domain.Documents.User.UserSession, BaseSearchDTO>
    {
        Task<Domain.Documents.User.UserSession?> GetByAccount(Guid userAccountId, CancellationToken cancellationToken = default);
    }

}
