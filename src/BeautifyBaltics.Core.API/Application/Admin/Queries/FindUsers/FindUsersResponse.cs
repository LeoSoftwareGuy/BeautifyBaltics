using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.FindUsers;

public record FindUsersResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public required Guid Id { get; init; }

    /// <summary>
    /// Email address
    /// </summary>
    public required string Email { get; init; }

    /// <summary>
    /// First name
    /// </summary>
    public required string FirstName { get; init; }

    /// <summary>
    /// Last name
    /// </summary>
    public required string LastName { get; init; }

    /// <summary>
    /// Full name
    /// </summary>
    public required string FullName { get; init; }

    /// <summary>
    /// Phone number
    /// </summary>
    public required string PhoneNumber { get; init; }

    /// <summary>
    /// User role
    /// </summary>
    public required UserRole Role { get; init; }

    /// <summary>
    /// Whether email is verified
    /// </summary>
    public required bool EmailVerified { get; init; }

    /// <summary>
    /// Account creation date
    /// </summary>
    public required DateTimeOffset CreatedAt { get; init; }
}
