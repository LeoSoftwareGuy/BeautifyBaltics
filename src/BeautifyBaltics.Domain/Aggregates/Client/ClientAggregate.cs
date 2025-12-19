using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.SeedWork;
using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Client;

public class ClientAggregate : Aggregate
{
    public ClientAggregate() { }

    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public ContactInformation Contacts { get; private set; } = new(string.Empty, string.Empty);

    public ClientAggregate(ClientCreated @event) : this()
    {
    }

    public void Apply(ClientProfileUpdated @event)
    {
        FirstName = @event.FirstName;
        LastName = @event.LastName;
        Contacts = @event.Contacts;
    }
}
