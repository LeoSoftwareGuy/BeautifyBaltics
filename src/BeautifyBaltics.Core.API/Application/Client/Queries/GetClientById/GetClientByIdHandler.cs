using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Client;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Client.Queries.GetClientById
{
    public class GetClientByIdHandler(
        IClientRepository clientRepository,
        IBlobStorageService<ClientAggregate.ClientProfileImage> blobStorageService
    )
    {
        public async Task<GetClientByIdResponse?> Handle(GetClientByIdRequest request, CancellationToken cancellationToken)
        {
            var client = await clientRepository.GetByIdAsync(request.Id, cancellationToken)
                ?? throw NotFoundException.For<Persistence.Projections.Client>(request.Id);

            var response = client.Adapt<GetClientByIdResponse>();
            return response with
            {
                ProfileImageUrl = blobStorageService.GetBlobUrl(client.ProfileImageBlobName)
            };
        }
    }
}
