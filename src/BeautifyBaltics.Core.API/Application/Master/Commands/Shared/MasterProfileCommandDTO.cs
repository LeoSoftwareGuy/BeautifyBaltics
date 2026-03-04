using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public record MasterProfileCommandDTO
{
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
    /// Age
    /// </summary>
    public int? Age { get; init; }

    /// <summary>
    /// Gender
    /// </summary>
    public Gender? Gender { get; init; }

    /// <summary>
    /// Description
    /// </summary>
    public string? Description { get; init; }

    /// <summary>
    /// Email address
    /// </summary>
    [Required]
    public required string Email { get; init; }

    /// <summary>
    /// Phone number
    /// </summary>
    [Required]
    public required string PhoneNumber { get; init; }

    /// <summary>
    /// Latitude of the service lcoation
    /// </summary>
    public double? Latitude { get; init; }

    /// <summary>
    /// Longitude of the service lcoation
    /// </summary>
    public double? Longitude { get; init; }

    /// <summary>
    /// City of the service lcoation
    /// </summary>
    public string? City { get; init; }

    /// <summary>
    /// Country of the service lcoation
    /// </summary>
    public string? Country { get; init; }

    /// <summary>
    /// Address line 1
    /// </summary>
    public string? AddressLine1 { get; init; }

    /// <summary>
    /// Address line 2
    /// </summary>
    public string? AddressLine2 { get; init; }

    /// <summary>
    /// Postal code
    /// </summary>
    public string? PostalCode { get; init; }
}
