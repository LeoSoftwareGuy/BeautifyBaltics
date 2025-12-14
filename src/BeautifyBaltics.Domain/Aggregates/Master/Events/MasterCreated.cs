using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterCreated(
    Guid MasterId,
    string FirstName,
    string LastName,
    int? Age,
    string? Gender,
    ContactInformation Contacts
);
