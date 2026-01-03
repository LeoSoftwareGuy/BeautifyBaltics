using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterCreated(
    string FirstName,
    string LastName,
    ContactInformation Contacts,
    string SupabaseUserId
);
