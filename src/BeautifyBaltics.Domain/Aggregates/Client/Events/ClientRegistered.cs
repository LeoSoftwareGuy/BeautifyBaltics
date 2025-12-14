using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Client.Events;

public record ClientRegistered(
    Guid ClientId,
    string FirstName,
    string LastName,
    ContactInformation Contacts
);