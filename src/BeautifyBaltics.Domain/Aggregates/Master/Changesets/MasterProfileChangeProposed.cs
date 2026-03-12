using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Master.Changesets;

public record MasterProfileChangeProposed(
    string FirstName,
    string LastName,
    int? Age,
    Gender? Gender,
    string? Description,
    ContactInformation Contacts,
    double? Latitude,
    double? Longitude,
    string? City,
    string? Country,
    string? AddressLine1,
    string? AddressLine2,
    string? PostalCode
);
