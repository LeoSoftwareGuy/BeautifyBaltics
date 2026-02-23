using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.ValueObjects;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.CreateClient
{
    public class CreateClientEventHandler(ICommandRepository commandRepository)
    {
        public CreateClientResponse Handle(CreateClientRequest request, CancellationToken cancellationToken)
        {
            var contacts = new ContactInformation(request.Email, request.PhoneNumber);

            var @event = new ClientCreated(
             FirstName: request.FirstName,
             LastName: request.LastName,
             Contacts: contacts,
             UserId: request.UserId
            );

            var id = commandRepository.StartStream<ClientAggregate>(@event);

            return new CreateClientResponse(id);
        }
    }
}
