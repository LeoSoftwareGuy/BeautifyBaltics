using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Client;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Client.Queries.GetClientById
{
    public class GetClientByIdHandler(IClientRepository clientRepository)
    {
        public async Task<GetClientByIdResponse?> Handle(GetClientByIdRequest request, CancellationToken cancellationToken)
        {
            var result = await clientRepository.GetByIdAsync(request.Id, cancellationToken)
                ?? throw NotFoundException.For<Persistence.Projections.Client>(request.Id);

            return result.Adapt<GetClientByIdResponse>();
        }
    }
}
