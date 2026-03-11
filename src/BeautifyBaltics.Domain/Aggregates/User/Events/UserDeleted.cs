namespace BeautifyBaltics.Domain.Aggregates.User.Events;

public record UserDeleted(Guid UserId, DateTimeOffset DeletedAt);
