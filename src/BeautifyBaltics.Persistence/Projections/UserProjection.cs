using BeautifyBaltics.Domain.Aggregates.User.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using JasperFx.Events;
using Marten.Events.Aggregation;

namespace BeautifyBaltics.Persistence.Projections;

public record UserProjection(Guid Id) : Projection
{
    public required string Email { get; init; }
    public required string PasswordHash { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string PhoneNumber { get; init; }
    public UserRole Role { get; init; }
    public bool EmailVerified { get; init; }
    public DateTimeOffset JoinedAt { get; init; }
    public string FullName => $"{FirstName} {LastName}".Trim();
}

public class UserProjectionProjection : SingleStreamProjection<UserProjection, Guid>
{
    public UserProjectionProjection()
    {
        DeleteEvent<UserDeleted>();
    }

    public static UserProjection Create(IEvent<UserRegistered> @event) => new(@event.Data.UserId)
    {
        Email = @event.Data.Email,
        PasswordHash = @event.Data.PasswordHash,
        FirstName = @event.Data.FirstName,
        LastName = @event.Data.LastName,
        PhoneNumber = @event.Data.PhoneNumber,
        Role = @event.Data.Role,
        EmailVerified = false,
        JoinedAt = @event.Data.JoinedAt
    };

    public static UserProjection Apply(UserRoleChanged @event, UserProjection current) =>
        current with { Role = @event.Role };

    public static UserProjection Apply(UserEmailVerified @event, UserProjection current) =>
        current with { EmailVerified = true };

    public static UserProjection Apply(UserPasswordChanged @event, UserProjection current) =>
        current with { PasswordHash = @event.PasswordHash };
}
