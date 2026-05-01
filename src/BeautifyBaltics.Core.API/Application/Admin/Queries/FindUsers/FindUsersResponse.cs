using BeautifyBaltics.Domain.Enumerations;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.FindUsers;

public record FindUsersResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    [Required]
    public required Guid Id { get; init; }

    /// <summary>
    /// Email address
    /// </summary>
    [Required]
    public required string Email { get; init; }

    /// <summary>
    /// First name
    /// </summary>
    [Required]
    public required string FirstName { get; init; }

    /// <summary>
    /// Last name
    /// </summary>
    [Required]
    public required string LastName { get; init; }

    /// <summary>
    /// Full name
    /// </summary>
    [Required]
    public required string FullName { get; init; }

    /// <summary>
    /// Phone number
    /// </summary>
    [Required]
    public required string PhoneNumber { get; init; }

    /// <summary>
    /// User role
    /// </summary>
    [Required]
    public required UserRole Role { get; init; }

    /// <summary>
    /// Whether email is verified
    /// </summary>
    [Required]
    public required bool EmailVerified { get; init; }

    /// <summary>
    /// Account registration date
    /// </summary>
    [Required]
    public required DateTimeOffset JoinedAt { get; init; }

    /// <summary>
    /// Total bookings
    /// </summary>
    [Required]
    public int TotalBookings { get; init; }

    /// <summary>
    /// Total earnings
    /// </summary>
    [Required]
    public decimal Earnings { get; init; }

    /// <summary>
    /// Master rating, 0 for clients
    /// </summary>
    [Required]
    public decimal Rating { get; init; }

    /// <summary>
    /// KYC verification status (masters only)
    /// </summary>
    public KycStatus? KycStatus { get; init; }
}
