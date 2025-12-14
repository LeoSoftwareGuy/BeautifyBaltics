using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Client.Events;

public record ClientProfileUpdated(
    Guid ClientId,
    string FirstName,
    string LastName,
    ContactInformation Contacts
);
