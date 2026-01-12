using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Master;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterProfileImage;

public class GetMasterProfileImageHandler(
    IMasterRepository masterRepository,
    IBlobStorageService<MasterAggregate.MasterProfileImage> blobStorageService
)
{
    public async Task<GetMasterProfileImageResponse> Handle(GetMasterProfileImageRequest request, CancellationToken cancellationToken)
    {
        var master = await masterRepository.GetByIdAsync(request.MasterId, cancellationToken)
            ?? throw NotFoundException.For<Persistence.Projections.Master>(request.MasterId);

        if (string.IsNullOrEmpty(master.ProfileImageBlobName))
            throw NotFoundException.For<MasterAggregate.MasterProfileImage>(request.MasterId);

        var data = await blobStorageService.DownloadAsync(master.ProfileImageBlobName, cancellationToken);

        return new GetMasterProfileImageResponse
        {
            FileName = master.ProfileImageFileName ?? string.Empty,
            FileMimeType = master.ProfileImageMimeType ?? string.Empty,
            FileSize = master.ProfileImageSize ?? 0,
            Data = data
        };
    }
}
