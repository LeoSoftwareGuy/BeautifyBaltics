using BeautifyBaltics.Persistence.Repositories.User.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.User
{
    public class UserRepository(IQuerySession session) : QueryRepository<Domain.Documents.User.User, UserSearchDTO>(session), IUserRepository
    {
        public override Task<IPagedList<Domain.Documents.User.User>> GetPagedListAsync(UserSearchDTO search,
               CancellationToken cancellationToken = default
        )
        {
            var query = _session.Query<Domain.Documents.User.User>().AsQueryable();

            if (search.Role is not null) query = query.Where(x => x.Role == search.Role);
            if (search.FirstName is not null) query = query.Where(x => x.FirstName.NgramSearch(search.FirstName));
            if (search.Email is not null) query = query.Where(x => x.Email.NgramSearch(search.Email));

            return query.ToPagedListAsync(search.Page, search.PageSize, cancellationToken);
        }

        public async Task<Domain.Documents.User.User?> GetByEmail(string email, CancellationToken cancellationToken)
        {
            return await _session.Query<Domain.Documents.User.User>()
                .Where(x => x.Email != null && x.Email.Equals(email, StringComparison.InvariantCulture))
                .FirstOrDefaultAsync(cancellationToken);
        }

        public Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default) =>
            _session.Query<Domain.Documents.User.User>().Where(x => x.Email != null && x.Email.Equals(email, StringComparison.InvariantCulture))
                .AnyAsync(cancellationToken);
    }
}
