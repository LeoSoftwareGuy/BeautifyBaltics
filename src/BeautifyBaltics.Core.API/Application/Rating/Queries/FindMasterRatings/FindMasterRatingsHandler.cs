using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Repositories.Rating;
using BeautifyBaltics.Persistence.Repositories.Rating.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Rating.Queries.FindMasterRatings
{
    public class FindMasterRatingsHandler(IRatingRepository repository)
    {
        public async Task<PagedResponse<FindMasterRatingsResponse>> Handle(FindMasterRatingsRequest request, CancellationToken cancellationToken)
        {
            var search = request.Adapt<RatingSearchDTO>();
            var result = await repository.GetPagedListAsync(search, cancellationToken);
            return result.ToPagedResponse<Persistence.Projections.Rating, FindMasterRatingsResponse>();
        }
    }
}
