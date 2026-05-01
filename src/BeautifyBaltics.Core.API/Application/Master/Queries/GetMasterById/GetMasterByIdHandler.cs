using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Master;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterById;

public class GetMasterByIdHandler(
    IMasterRepository masterRepository,
    IBlobStorageService<MasterAggregate.MasterProfileImage> blobStorageService
)
{
    public async Task<GetMasterByIdResponse> Handle(GetMasterByIdRequest request, CancellationToken cancellationToken)
    {
        var master = await masterRepository.GetByIdAsync(request.Id, cancellationToken)
                     ?? throw NotFoundException.For<Persistence.Projections.Master>(request.Id);

        var isSelfAccess = request.RequesterId.HasValue && request.RequesterId.Value == master.UserId;
        if (!isSelfAccess && master.KycStatus != KycStatus.Approved)
        {
            throw NotFoundException.For<Persistence.Projections.Master>(request.Id);
        }

        var response = master.Adapt<GetMasterByIdResponse>();
        return response with
        {
            ProfileImageUrl = blobStorageService.GetBlobUrl(master.ProfileImageBlobName),
        };
    }
}
