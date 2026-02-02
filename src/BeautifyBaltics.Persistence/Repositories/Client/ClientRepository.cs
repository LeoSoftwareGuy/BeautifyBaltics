using BeautifyBaltics.Persistence.Repositories.Client.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Client;

public class ClientRepository(IQuerySession session) : QueryRepository<Projections.Client, ClientSearchDTO>(session), IClientRepository
{
    public Task<Projections.Client?> GetBySupabaseUserIdAsync(string supabaseUserId, CancellationToken cancellationToken = default) =>
        _session.Query<Projections.Client>()
            .FirstOrDefaultAsync(x => x.SupabaseUserId == supabaseUserId, cancellationToken);

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

        if (search.FirstName is not null) query = query.Where(x => x.FirstName.NgramSearch(search.FirstName));
        if (search.LastName is not null) query = query.Where(x => x.LastName.NgramSearch(search.LastName));
        if (search.Email is not null) query = query.Where(x => x.Email.NgramSearch(search.Email));

        return query;
    }
}
