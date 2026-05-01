using BeautifyBaltics.Domain.Aggregates.User.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.Aggregates.User;

public class UserAggregate : Aggregate
{
    public string Email { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public UserRole Role { get; private set; }
    public bool EmailVerified { get; private set; }
    public DateTimeOffset JoinedAt { get; private set; }
    public string PasswordHash { get; private set; } = string.Empty;
    public bool Deleted { get; private set; }

    public void Apply(UserRegistered @event)
    {
        Id = @event.UserId;
        Email = @event.Email;
        FirstName = @event.FirstName;
        LastName = @event.LastName;
        PhoneNumber = @event.PhoneNumber;
        Role = @event.Role;
        JoinedAt = @event.JoinedAt;
        PasswordHash = @event.PasswordHash;
        EmailVerified = false;
        Deleted = false;
    }

    public void Apply(UserRoleChanged @event) => Role = @event.Role;

    public void Apply(UserEmailVerified @event) => EmailVerified = true;

    public void Apply(UserPasswordChanged @event) => PasswordHash = @event.PasswordHash;

    public void Apply(UserDeleted @event) => Deleted = true;
}
