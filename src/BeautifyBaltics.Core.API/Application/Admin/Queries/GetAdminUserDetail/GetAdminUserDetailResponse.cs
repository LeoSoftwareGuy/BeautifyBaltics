using BeautifyBaltics.Domain.Enumerations;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetAdminUserDetail;

public record GetAdminUserDetailResponse
{
    /// <summary>
    /// User identifier
    /// </summary>
    [Required]
    public required Guid Id { get; init; }

    /// <summary>
    /// User full name
    /// </summary>
    [Required]
    public required string FullName { get; init; }

    /// <summary>
    /// User email
    /// </summary>
    [Required]
    public required string Email { get; init; }

    /// <summary>
    /// User role
    /// </summary>
    [Required]
    public required UserRole Role { get; init; }

    /// <summary>
    /// Master aggregate ID — used to build the public profile URL (/masters/{id})
    /// </summary>
    public Guid? MasterProfileId { get; init; }

    /// <summary>
    /// Master city
    /// </summary>
    public string? City { get; init; }

   /// <summary>
   /// Master description
   /// </summary>
    public string? Description { get; init; }

    /// <summary>
    /// Master rating
    /// </summary>
    public decimal? Rating { get; init; }

    /// <summary>
    /// Services offered by master
    /// </summary>
    [Required]
    public IReadOnlyList<string> Services { get; init; } = [];

    /// <summary>
    /// Categories offered by master
    /// </summary>
    [Required]
    public IReadOnlyList<string> Categories { get; init; } = [];

    /// <summary>
    /// Bookig history for the last 6 months
    /// </summary>
    [Required]
    public required IReadOnlyList<UserBookingHistoryEntry> BookingHistory { get; init; }
}

public record UserBookingHistoryEntry(int Year, int Month, int Count, decimal Earnings);
