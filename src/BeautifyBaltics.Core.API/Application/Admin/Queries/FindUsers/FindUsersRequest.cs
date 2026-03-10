using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.FindUsers;

public record FindUsersRequest : PagedRequest
{
    /// <summary>
    /// Filter by role
    /// </summary>
    public UserRole? Role { get; init; }

    /// <summary>
    /// Filter by first name
    /// </summary>
    public string? FirstName { get; init; }

    /// <summary>
    /// Filter by last name
    /// </summary>
    public string? LastName { get; init; }

    /// <summary>
    /// Filter by email address
    /// </summary>
    public string? Email { get; init; }

    /// <summary>
    /// Search by name or email
    /// </summary>
    public string? Search { get; init; }
}
