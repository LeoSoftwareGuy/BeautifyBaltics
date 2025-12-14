using Marten.Pagination;
using System.Linq.Expressions;

namespace BeautifyBaltics.Persistence.Repositories.SeedWork
{
    /// <summary>
    /// Base interface for query repositories
    /// </summary>
    public interface IQueryRepository<T, in TSearch> where T : notnull where TSearch : BaseSearchDTO?
    {
        /// <summary>
        /// Get entity by id
        /// </summary>
        /// <param name="id">Entity ID</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <typeparam name="T">Domain object that represents the queryable type</typeparam>
        /// <returns>Entity or null if not found</returns>
        Task<T?> GetByIdAsync(object id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Get paged list of entities
        /// </summary>
        /// <param name="search">Search parameters</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <typeparam name="T">Domain object that represents the queryable type</typeparam>
        /// <returns>Paged list of entities</returns>
        Task<IPagedList<T>> GetPagedListAsync(TSearch search, CancellationToken cancellationToken = default);

        /// <summary>
        /// Get list of entities
        /// </summary>
        /// <param name="search">Search parameters</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <typeparam name="T">Domain object that represents the queryable type</typeparam>
        /// <returns>List of entities</returns>
        Task<IReadOnlyList<T>> GetListAsync(TSearch search, CancellationToken cancellationToken = default);

        /// <summary>
        /// Check if entity exists by predicate
        /// </summary>
        /// <param name="predicate">Predicate to check</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <typeparam name="T">Domain object that represents the queryable type</typeparam>
        /// <returns>True if entity exists, otherwise false</returns>
        Task<bool> ExistsByAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);

        /// <summary>
        /// Get list of entities matching the given predicate
        /// </summary>
        /// <param name="predicate">Predicate to filter entities</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <typeparam name="T">Domain object that represents the queryable type</typeparam>
        /// <returns>List of entities matching the predicate</returns>
        Task<IReadOnlyList<T>> GetListByAsync(Expression<Func<T, bool>> predicate,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Count the number of entities matching the search criteria
        /// </summary>
        /// <param name="search">Search parameters</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>>Total count of entities matching the search criteria</returns>
        Task<int> CountAsync(TSearch search, CancellationToken cancellationToken = default);
    }
}
