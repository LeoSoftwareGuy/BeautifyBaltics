using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Domain.Documents;

public class UserAccount
{
    public Guid Id { get; init; }
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public UserRole Role { get; init; }
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public bool EmailVerified { get; private set; }
    public DateTimeOffset CreatedAt { get; init; }

    private UserAccount() { }

    public UserAccount(Guid id, string email, string passwordHash, UserRole role, string firstName, string lastName, string phoneNumber)
    {
        Id = id;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        EmailVerified = false;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public void SetEmailVerified() => EmailVerified = true;

    public void UpdatePasswordHash(string newPasswordHash) => PasswordHash = newPasswordHash;

    public string FullName => $"{FirstName} {LastName}".Trim();
}
