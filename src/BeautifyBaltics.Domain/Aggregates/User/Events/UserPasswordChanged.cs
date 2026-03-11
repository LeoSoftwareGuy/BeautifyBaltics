namespace BeautifyBaltics.Domain.Aggregates.User.Events;

public record UserPasswordChanged(Guid UserId, string PasswordHash);
