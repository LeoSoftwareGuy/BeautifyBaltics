using BeautifyBaltics.Domain.Enumerations;
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

        public async Task<Domain.Documents.User.User?> GetByEmailAsync(string email, UserRole? role = null, CancellationToken cancellationToken = default)
        {
            var normalized = NormalizeEmail(email);
            var query = _session.Query<Domain.Documents.User.User>()
                .Where(x => x.Email != null && x.Email.Equals(normalized, StringComparison.InvariantCulture));

            if (role is not null)
            {
                query = query.Where(x => x.Role == role);
            }

            return await query.FirstOrDefaultAsync(cancellationToken);
        }

        public Task<bool> ExistsByEmailAsync(string email, UserRole? role = null, CancellationToken cancellationToken = default)
        {
            var normalized = NormalizeEmail(email);
            var query = _session.Query<Domain.Documents.User.User>()
                .Where(x => x.Email != null && x.Email.Equals(normalized, StringComparison.InvariantCulture));

            if (role is not null)
            {
                query = query.Where(x => x.Role == role);
            }

            return query.AnyAsync(cancellationToken);
        }

        public Task<bool> ExistsByPhoneNumberAsync(string phoneNumber, CancellationToken cancellationToken = default)
        {
            var query = _session.Query<Domain.Documents.User.User>().Where(x => x.PhoneNumber == phoneNumber);

            return query.AnyAsync(cancellationToken);
        }

        private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
    }
}
