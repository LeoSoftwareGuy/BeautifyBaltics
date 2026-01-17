using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Master;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasters;

public class FindMastersHandler(
    IMasterRepository repository,
    IBlobStorageService<MasterAggregate.MasterProfileImage> blobStorageService
)
{
    public async Task<PagedResponse<FindMastersResponse>> Handle(FindMastersRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<Persistence.Repositories.Master.DTOs.MasterSearchDTO>();
        var result = await repository.GetPagedListAsync(search, cancellationToken);
        var pagedResponse = result.ToPagedResponse<Persistence.Projections.Master, FindMastersResponse>();

        var itemsWithImages = pagedResponse.Items.Zip(result, (dto, projection) => dto with
        {
            ProfileImageUrl = blobStorageService.GetBlobUrl(projection.ProfileImageBlobName)
        }).ToArray();

        return pagedResponse with { Items = itemsWithImages };
    }
}
