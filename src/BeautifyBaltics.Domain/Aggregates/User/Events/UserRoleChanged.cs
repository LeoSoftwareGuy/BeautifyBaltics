using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Domain.Aggregates.User.Events;

public record UserRoleChanged(Guid UserId, UserRole Role);
