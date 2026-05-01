using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterAvailability;

public class GetMasterAvailabilityHandler(IMasterRepository masterRepository)
{
    public async Task<GetMasterAvailabilityResponse> Handle(GetMasterAvailabilityRequest request, CancellationToken cancellationToken)
    {
        var master = await masterRepository.GetByIdAsync(request.MasterId, cancellationToken)
            ?? throw NotFoundException.For<Persistence.Projections.Master>(request.MasterId);

        var slot = master.Availabilities.FirstOrDefault(s => s.Id == request.MasterAvailabilityId)
            ?? throw NotFoundException.For<MasterAvailabilityWindow>(request.MasterAvailabilityId);

        return slot.Adapt<GetMasterAvailabilityResponse>();
    }
}
