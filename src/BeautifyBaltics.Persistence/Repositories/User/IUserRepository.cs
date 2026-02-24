using BeautifyBaltics.Persistence.Repositories.SeedWork;
using BeautifyBaltics.Persistence.Repositories.User.DTOs;

namespace BeautifyBaltics.Persistence.Repositories.User
{
    public interface IUserRepository : IQueryRepository<Domain.Documents.User.User, UserSearchDTO>
    {
        /// <summary>
        /// Retrieves user by email
        /// </summary>
        /// <param name="email">Email of the user</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>User if found, otherwise, null</returns>
        Task<Domain.Documents.User.User?> GetByEmail(string email, CancellationToken cancellationToken = default);

        /// <summary>
        /// Checks if a user with the specified email exists.
        /// </summary>
        /// <param name="email">Email to check for existence</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>True if a user with the email exists, otherwise false</returns>
        Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);
    }
}
