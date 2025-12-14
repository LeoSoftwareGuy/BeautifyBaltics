using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterProfileUpdated(
    Guid MasterId,
    string FirstName,
    string LastName,
    int? Age,
    string? Gender,
    ContactInformation Contacts
);