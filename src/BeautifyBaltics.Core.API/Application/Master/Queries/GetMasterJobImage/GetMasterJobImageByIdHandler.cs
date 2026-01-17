using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Master;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterJobImage;

public class GetMasterJobImageByIdHandler(
    IMasterJobRepository masterJobRepository,
    IBlobStorageService<MasterJobImage> blobStorageService
)
{
    public async Task<GetMasterJobImageByIdResponse> Handle(GetMasterJobImageByIdRequest request, CancellationToken cancellationToken)
    {
        var job = await masterJobRepository.GetByIdAsync(request.MasterJobId, cancellationToken)
            ?? throw NotFoundException.For<Persistence.Projections.MasterJob>(request.MasterJobId);

        if (job.MasterId != request.MasterId) throw NotFoundException.For<Persistence.Projections.MasterJob>(request.MasterJobId);

        var image = job.Images?.FirstOrDefault(i => i.Id == request.MasterJobImageId)
                    ?? throw NotFoundException.For<MasterJobImage>(request.MasterJobImageId);

        return new GetMasterJobImageByIdResponse
        {
            FileName = image.FileName,
            FileMimeType = image.FileMimeType,
            FileSize = image.FileSize,
            Url = blobStorageService.GetBlobUrl(image.BlobName) ?? string.Empty
        };
    }
}
