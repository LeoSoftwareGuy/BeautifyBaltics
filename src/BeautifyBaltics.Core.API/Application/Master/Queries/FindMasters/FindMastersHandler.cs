using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Repositories.Master;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasters;

public class FindMastersHandler(IMasterRepository repository)
{
    public async Task<PagedResponse<FindMastersResponse>> Handle(FindMastersRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<Persistence.Repositories.Master.DTOs.MasterSearchDTO>();
        var result = await repository.GetPagedListAsync(search, cancellationToken);
        return result.ToPagedResponse<Persistence.Projections.Master, FindMastersResponse>();
    }
}
