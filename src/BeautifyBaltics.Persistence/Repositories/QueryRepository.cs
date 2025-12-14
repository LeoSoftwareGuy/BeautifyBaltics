using BeautifyBaltics.Persistence.Repositories.SeedWork;
using Marten.Pagination;
using Marten;
using System.Linq.Expressions;

namespace BeautifyBaltics.Persistence.Repositories;

public class QueryRepository<T, TSearch>(IQuerySession session) : IQueryRepository<T, TSearch> where T : notnull where TSearch : BaseSearchDTO
{
    protected readonly IQuerySession _session = session;

    public virtual Task<T?> GetByIdAsync(object id, CancellationToken cancellationToken = default) =>
        _session.LoadAsync<T>(id, cancellationToken);

    public virtual Task<IPagedList<T>> GetPagedListAsync(TSearch search, CancellationToken cancellationToken = default) =>
        _session.Query<T>().ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public virtual Task<int> CountAsync(TSearch search, CancellationToken cancellationToken = default) =>
        _session.Query<T>().CountAsync(cancellationToken);

    public virtual Task<IReadOnlyList<T>> GetListAsync(TSearch search, CancellationToken cancellationToken = default) =>
        _session.Query<T>().ToListAsync(cancellationToken);

    public Task<bool> ExistsByAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default) =>
        _session.Query<T>().AnyAsync(predicate, cancellationToken);

    public Task<IReadOnlyList<T>> GetListAsync(CancellationToken cancellationToken = default) =>
        _session.Query<T>().ToListAsync(cancellationToken);

    public Task<IReadOnlyList<T>> GetListByAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default) =>
        _session.Query<T>().Where(predicate).ToListAsync(cancellationToken);
}