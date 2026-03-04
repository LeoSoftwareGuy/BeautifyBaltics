using System.Text.Json.Serialization;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Domain.Documents.User;

public class User
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

    [JsonConstructor]
    private User(Guid id, string email, string passwordHash, UserRole role, string firstName, string lastName, string phoneNumber, bool emailVerified, DateTimeOffset createdAt)
    {
        Id = id;
        Email = NormalizeEmail(email);
        PasswordHash = passwordHash;
        Role = role;
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        EmailVerified = emailVerified;
        CreatedAt = createdAt;
    }

    public User(Guid id, string email, string passwordHash, UserRole role, string firstName, string lastName, string phoneNumber)
    {
        Id = id;
        Email = NormalizeEmail(email);
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

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
}
