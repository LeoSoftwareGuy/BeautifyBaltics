using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Repositories.Master;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterAvailabilities;

public class FindMasterAvailabilitiesHandler(IMasterAvailabilitySlotRepository masterAvailabilitySlotRepository)
{
    public async Task<PagedResponse<FindMasterAvailabilitiesResponse>> Handle(FindMasterAvailabilitiesRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<Persistence.Repositories.Master.DTOs.MasterAvailabilitySlotSearchDTO>();
        var result = await masterAvailabilitySlotRepository.GetPagedListAsync(search, cancellationToken);
        return result.ToPagedResponse<Persistence.Projections.MasterAvailabilitySlot, FindMasterAvailabilitiesResponse>();
    }
}
