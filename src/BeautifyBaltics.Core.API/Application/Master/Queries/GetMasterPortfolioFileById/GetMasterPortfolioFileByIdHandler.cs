using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterPortfolioFileById
{
    public class GetMasterPortfolioFileByIdHandler(
        IMasterPortfolioImageRepository masterPortfolioImageRepository,
        IBlobStorageService<MasterPortfolioImage> blobStorageService
    )
    {
        public async Task<GetMasterPortfolioFileByIdResponse> Handle(GetMasterPortfolioFileByIdRequest request, CancellationToken cancellationToken)
        {
            var file = await masterPortfolioImageRepository.GetByIdAsync(request.MasterPortfolioFileId, cancellationToken)
                ?? throw NotFoundException.For<MasterPortfolioImage>(request.MasterPortfolioFileId);

            if (file.MasterId != request.MasterId) throw NotFoundException.For<MasterPortfolioImage>(request.MasterPortfolioFileId);

            var fileBytes = await blobStorageService.DownloadAsync(file.BlobName, cancellationToken);

            return file.Adapt<GetMasterPortfolioFileByIdResponse>() with
            {
                Data = fileBytes
            };
        }
    }
}
