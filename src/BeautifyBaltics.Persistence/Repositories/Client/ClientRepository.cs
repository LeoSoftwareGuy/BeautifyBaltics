using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Client;

public class ClientRepository(IQuerySession session) : QueryRepository<Projections.Client, ClientSearchDTO>(session), IClientRepository
{
    public override Task<IPagedList<Projections.Client>> GetPagedListAsync(ClientSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<Projections.Client>> GetListAsync(ClientSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToListAsync(cancellationToken);

    private IQueryable<Projections.Client> BuildSearchQuery(ClientSearchDTO search)
    {
        var query = _session.Query<Projections.Client>().AsQueryable();

        if (string.IsNullOrWhiteSpace(search.Text)) return query;

        query = query.Where(x => x.FirstName.Contains(search.Text));
        query = query.Where(x => x.LastName.Contains(search.Text));
        query = query.Where(x => x.Email.Contains(search.Text));

        return query;
    }
}
