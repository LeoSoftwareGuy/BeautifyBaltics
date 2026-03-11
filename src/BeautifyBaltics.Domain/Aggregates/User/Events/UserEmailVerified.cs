namespace BeautifyBaltics.Domain.Aggregates.User.Events;

public record UserEmailVerified(Guid UserId, DateTimeOffset VerifiedAt);
