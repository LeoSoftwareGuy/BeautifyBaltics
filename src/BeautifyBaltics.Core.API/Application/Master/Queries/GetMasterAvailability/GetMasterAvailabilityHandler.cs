using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterAvailability;

public class GetMasterAvailabilityHandler(
    IMasterRepository masterRepository,
    IMasterAvailabilitySlotRepository masterAvailabilitySlotRepository
)
{
    public async Task<GetMasterAvailabilityResponse> Handle(GetMasterAvailabilityRequest request, CancellationToken cancellationToken)
    {
        if (!await masterRepository.ExistsByAsync(x => x.Id == request.MasterId, cancellationToken))
            throw NotFoundException.For<Persistence.Projections.Master>(request.MasterId);

        var availability = await masterAvailabilitySlotRepository.GetByIdAsync(request.MasterAvailabilityId, cancellationToken)
            ?? throw NotFoundException.For<MasterAvailabilitySlot>(request.MasterAvailabilityId);

        return availability.Adapt<GetMasterAvailabilityResponse>();
    }
}
