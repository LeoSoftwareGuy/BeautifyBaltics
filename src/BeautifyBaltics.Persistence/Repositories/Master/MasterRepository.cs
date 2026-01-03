using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Master;

public class MasterRepository(IQuerySession session) : QueryRepository<Projections.Master, MasterSearchDTO>(session), IMasterRepository
{
    public Task<Projections.Master?> GetBySupabaseUserIdAsync(string supabaseUserId, CancellationToken cancellationToken = default) =>
        _session.Query<Projections.Master>()
            .FirstOrDefaultAsync(x => x.SupabaseUserId == supabaseUserId, cancellationToken);

    public override Task<IPagedList<Projections.Master>> GetPagedListAsync(MasterSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<Projections.Master>> GetListAsync(MasterSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .SortBy(search.SortBy, search.Ascending)
            .ToListAsync(cancellationToken);

    private IQueryable<Projections.Master> BuildSearchQuery(MasterSearchDTO search)
    {
        var query = _session.Query<Projections.Master>().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search.Text))
        {
            query = query.Where(x => x.FirstName.Contains(search.Text));
            query = query.Where(x => x.LastName.Contains(search.Text));
        }

        if (!string.IsNullOrWhiteSpace(search.City))
        {
            query = query.Where(x => x.City == search.City);
        }

        return query;
    }
}
