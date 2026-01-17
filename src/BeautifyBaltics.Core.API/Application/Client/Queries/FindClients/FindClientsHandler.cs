using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Client;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Client.Queries.FindClients
{
    public class FindClientsHandler(
        IClientRepository repository,
        IBlobStorageService<ClientAggregate.ClientProfileImage> blobStorageService
    )
    {
        public async Task<PagedResponse<FindClientsResponse>> Handle(FindClientsRequest request, CancellationToken cancellationToken)
        {
            var search = request.Adapt<ClientSearchDTO>();
            var result = await repository.GetPagedListAsync(search, cancellationToken);
            var pagedResponse = result.ToPagedResponse<Persistence.Projections.Client, FindClientsResponse>();

            var itemsWithImages = pagedResponse.Items.Zip(result, (dto, projection) => dto with
            {
                ProfileImageUrl = blobStorageService.GetBlobUrl(projection.ProfileImageBlobName)
            }).ToArray();

            return pagedResponse with { Items = itemsWithImages };
        }
    }
}
