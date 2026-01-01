using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Client.Events;

public record ClientCreated(
    string FirstName,
    string LastName,
    ContactInformation Contacts,
    string SupabaseUserId
);
