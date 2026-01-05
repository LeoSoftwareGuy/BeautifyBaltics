using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master;
using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterPortfolioFiles
{
    public class FindMasterPortfolioFilesHandler(IMasterPortfolioImageRepository queryRepository)
    {
        public async Task<PagedResponse<FindMasterPortfolioFilesResponse>> Handle(FindMasterPortfolioFilesRequest request, CancellationToken cancellationToken)
        {
            var search = request.Adapt<MasterPortfolioImageSearchDTO>();
            var result = await queryRepository.GetPagedListAsync(search, cancellationToken);
            return result.ToPagedResponse<MasterPortfolioImage, FindMasterPortfolioFilesResponse>();
        }
    }
}
