using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Domain.Aggregates.User.Events;

public record UserRegistered(
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    string PhoneNumber,
    UserRole Role,
    DateTimeOffset JoinedAt,
    string PasswordHash
);
