using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Booking.Queries.Shared;

public record BookingDTO
{
    /// <summary>
    /// ID
    /// </summary>
    [Required]
    public Guid Id { get; init; }

    /// <summary>
    /// Master ID
    /// </summary>
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Client ID
    /// </summary>
    [Required]
    public Guid ClientId { get; init; }

    /// <summary>
    /// Master job ID
    /// </summary>
    [Required]
    public Guid MasterJobId { get; init; }

    /// <summary>
    /// Client name
    /// </summary>
    [Required]
    public required string ClientName { get; init; }

    /// <summary>
    /// Master name
    /// </summary>
    [Required]
    public required string MasterName { get;init; }

    /// <summary>
    /// Master job title
    /// </summary>
    [Required]
    public required string MasterJobTitle { get; init; }

    /// <summary>
    /// Booking city
    /// </summary>
    public string? LocationCity { get; init; }

    /// <summary>
    /// Booking country
    /// </summary>
    public string? LocationCountry { get; init; }

    /// <summary>
    /// Address line 1
    /// </summary>
    public string? LocationAddressLine1 { get; init; }

    /// <summary>
    /// Address line 2
    /// </summary>
    public string? LocationAddressLine2 { get; init; }

    /// <summary>
    /// Postal code
    /// </summary>
    public string? LocationPostalCode { get; init; }

    /// <summary>
    /// Scheduled at
    /// </summary>
    [Required]
    public required DateTime ScheduledAt { get; init; }

    /// <summary>
    /// Duration
    /// </summary>
    [Required]
    public required TimeSpan Duration { get; init; }

    /// <summary>
    /// Price
    /// </summary>
    [Required]
    public required decimal Price { get; init; }

    /// <summary>
    /// Status
    /// </summary>
    [Required]
    public required BookingStatus Status { get; init; } 
}
