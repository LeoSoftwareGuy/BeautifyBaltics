using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.FindUsers;

public record FindUsersRequest : PagedRequest
{
    /// <summary>
    /// Text search across name and email
    /// </summary>
    public string? Search { get; init; }

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
    /// Filter by total bookings
    /// </summary>
    public int? TotalBookings { get; init; }

    /// <summary>
    /// Filter by rating
    /// </summary>
    public decimal? Rating { get; init;  }

    /// <summary>
    /// Filter by earnings
    /// </summary>
    public decimal? Earnings { get; init; }
}
