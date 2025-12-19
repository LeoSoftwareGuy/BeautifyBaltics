using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Repositories.Client;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Client.Queries.FindClients
{
    public class FindClientsHandler(IClientRepository repository)
    {
        public async Task<PagedResponse<FindClientsResponse>> Handle(FindClientsRequest request, CancellationToken cancellationToken)
        {
            var search = request.Adapt<ClientSearchDTO>();
            var result = await repository.GetPagedListAsync(search, cancellationToken);
            return result.ToPagedResponse<Persistence.Projections.Client, FindClientsResponse>();
        }
    }
}
