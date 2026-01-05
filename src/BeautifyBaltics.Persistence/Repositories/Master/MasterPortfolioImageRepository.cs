using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using Marten;
using Marten.Pagination;
using System.Linq;

namespace BeautifyBaltics.Persistence.Repositories.Master;

public class MasterPortfolioImageRepository(IQuerySession session)
    : QueryRepository<Projections.MasterPortfolioImage, MasterPortfolioImageSearchDTO>(session), IMasterPortfolioImageRepository
{
    public override Task<IPagedList<Projections.MasterPortfolioImage>> GetPagedListAsync(MasterPortfolioImageSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

    public override Task<IReadOnlyList<Projections.MasterPortfolioImage>> GetListAsync(MasterPortfolioImageSearchDTO search, CancellationToken cancellationToken = default) =>
        BuildSearchQuery(search)
            .ToListAsync(cancellationToken);

    private IQueryable<Projections.MasterPortfolioImage> BuildSearchQuery(MasterPortfolioImageSearchDTO search)
    {
        var query = _session.Query<Projections.MasterPortfolioImage>().AsQueryable();

        if (search.MasterId.HasValue)
        {
            query = query.Where(x => x.MasterId == search.MasterId.Value);
        }

        return query;
    }
}
