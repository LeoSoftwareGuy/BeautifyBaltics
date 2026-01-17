using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Master;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterJobImages;

public class FindMasterJobImagesHandler(
    IMasterRepository masterRepository,
    IMasterJobRepository masterJobRepository,
    IBlobStorageService<MasterJobImage> blobStorageService
)
{
    public async Task<FindMasterJobImagesResponse> Handle(FindMasterJobImagesRequest request, CancellationToken cancellationToken)
    {
        if (!await masterRepository.ExistsByAsync(x => x.Id == request.MasterId, cancellationToken)) throw NotFoundException.For<Persistence.Projections.Master>(request.MasterId);

        var jobs = await masterJobRepository.GetListByAsync(j => j.MasterId == request.MasterId, cancellationToken);

        var allImages = jobs
            .SelectMany(job => job.Images ?? [])
            .Select(image => new MasterJobImageWithUrlDTO
            {
                Id = image.Id,
                JobId = image.MasterJobId,
                FileName = image.FileName,
                FileMimeType = image.FileMimeType,
                FileSize = image.FileSize,
                Url = blobStorageService.GetBlobUrl(image.BlobName) ?? string.Empty
            })
            .ToList();

        return new FindMasterJobImagesResponse
        {
            Images = allImages
        };
    }
}
