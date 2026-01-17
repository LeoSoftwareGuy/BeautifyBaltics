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
        if (!await masterRepository.ExistsByAsync(x => x.Id == request.MasterId, cancellationToken))
            throw NotFoundException.For<Persistence.Projections.Master>(request.MasterId);

        var jobs = await masterJobRepository.GetListByAsync(j => j.MasterId == request.MasterId, cancellationToken);

        var allImages = jobs
            .SelectMany(job => job.Images ?? [])
            .ToList();

        var imagesWithData = new List<MasterJobImageWithDataDTO>();

        foreach (var image in allImages)
        {
            var data = await blobStorageService.DownloadAsync(image.BlobName, cancellationToken);

            imagesWithData.Add(new MasterJobImageWithDataDTO
            {
                Id = image.Id,
                JobId = image.MasterJobId,
                FileName = image.FileName,
                FileMimeType = image.FileMimeType,
                FileSize = image.FileSize,
                Data = Convert.ToBase64String(data)
            });
        }

        return new FindMasterJobImagesResponse
        {
            Images = imagesWithData
        };
    }
}
