using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Repositories.Rating;
using BeautifyBaltics.Persistence.Repositories.Rating.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Rating.Queries.GetMasterRatings;

public class GetMasterRatingsHandler(IRatingRepository repository)
{
    public async Task<PagedResponse<GetMasterRatingsResponse>> Handle(GetMasterRatingsRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<RatingSearchDTO>();
        var result = await repository.GetPagedListAsync(search, cancellationToken);
        return result.ToPagedResponse<Persistence.Projections.Rating, GetMasterRatingsResponse>();
    }
}
