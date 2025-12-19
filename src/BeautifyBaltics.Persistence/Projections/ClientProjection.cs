using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using JasperFx.Events;

using Marten.Events.Aggregation;

namespace BeautifyBaltics.Persistence.Projections;

public record Client(Guid Id) : Projection
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string PhoneNumber { get; init; } = string.Empty;
}

public class ClientProjection : SingleStreamProjection<Client, Guid>
{
    public static Client Create(IEvent<ClientCreated> @event)
    {
        return new Client(@event.StreamId)
        {
            FirstName = @event.Data.FirstName,
            LastName = @event.Data.LastName,
            Email = @event.Data.Contacts.Email,
            PhoneNumber = @event.Data.Contacts.PhoneNumber,
        };
    }

    public static Client Apply(ClientProfileUpdated @event, Client current)
    {
        return current with
        {
            FirstName = @event.FirstName,
            LastName = @event.LastName,
            Email = @event.Contacts.Email,
            PhoneNumber = @event.Contacts.PhoneNumber,
        };
    }
}
