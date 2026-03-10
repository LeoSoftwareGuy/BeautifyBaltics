using System.Text.Json.Serialization;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.Documents.User;

public class User : Document<Guid>
{
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public UserRole Role { get; private set; }
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public bool EmailVerified { get; private set; }

    [JsonConstructor]
    private User(Guid id, string email, string passwordHash, UserRole role, string firstName, string lastName, string phoneNumber, bool emailVerified)
        : base(id)
    {
        Email = NormalizeEmail(email);
        PasswordHash = passwordHash;
        Role = role;
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        EmailVerified = emailVerified;
    }

    public User(Guid id, string email, string passwordHash, UserRole role, string firstName, string lastName, string phoneNumber)
        : base(id)
    {
        Email = NormalizeEmail(email);
        PasswordHash = passwordHash;
        Role = role;
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        EmailVerified = false;
    }

    public void SetEmailVerified() => EmailVerified = true;

    public void UpdatePasswordHash(string newPasswordHash) => PasswordHash = newPasswordHash;

    public void SetRole(UserRole role) => Role = role;

    public string FullName => $"{FirstName} {LastName}".Trim();

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
}
