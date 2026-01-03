using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Domain.ValueObjects;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.UpdateClientProfile
{
    public class UpdateClientProfileEventHandler()
    {
        [AggregateHandler]
        public async Task<(Events, OutgoingMessages)> Handle(UpdateClientProfileRequest request, ClientAggregate client, CancellationToken cancellationToken)
        {
            if (client == null) throw NotFoundException.For<ClientAggregate>(request.ClientID);

            var contacts = new ContactInformation(request.Email, request.PhoneNumber);

            var profileUpdatedEvent = new ClientProfileUpdated(
                ClientId: client.Id,
                FirstName: request.FirstName,
                LastName: request.LastName,
                Contacts: contacts
            );

            return (
                [profileUpdatedEvent],
                [new UpdateClientProfileResponse(request.ClientID)]
            );
        }
    }
}
