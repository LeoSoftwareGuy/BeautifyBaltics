using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.CreateClient
{
    public class CreateClientEventHandler(ICommandRepository commandRepository)
    {
        public async Task<CreateClientResponse> Handle(CreateClientRequest request, CancellationToken cancellationToken)
        {
            var @event = new ClientCreated(
             FirstName: request.FirstName,
             LastName: request.LastName,
             Contacts: request.Contacts,
             SupabaseUserId: request.SupabaseUserId
            );

            var id = commandRepository.StartStream<ClientAggregate>(@event);

            return new CreateClientResponse(id);
        }
    }
}
