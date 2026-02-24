using BeautifyBaltics.Persistence.Repositories.SeedWork;
using Marten;

namespace BeautifyBaltics.Persistence.Repositories.User
{
    public class SessionRepository(IQuerySession session) : QueryRepository<Domain.Documents.User.UserSession, BaseSearchDTO>(session), ISessionRepository
    {
        public Task<Domain.Documents.User.UserSession?> GetByAccount(Guid userAccountId, CancellationToken cancellationToken = default)
        {
            var query = _session.Query<Domain.Documents.User.UserSession>().Where(x => x.UserId == userAccountId);

            return query.FirstOrDefaultAsync(cancellationToken);
        }
    }
}
