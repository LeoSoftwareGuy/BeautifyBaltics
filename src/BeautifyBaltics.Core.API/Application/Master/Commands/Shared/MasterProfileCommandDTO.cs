using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public record MasterProfileCommandDTO
{
    [Required]
    [MaxLength(128)]
    public required string FirstName { get; init; }

    [Required]
    [MaxLength(128)]
    public required string LastName { get; init; }

    [Range(18, 120)]
    public int? Age { get; init; }

    public Gender? Gender { get; init; }

    [MaxLength(1000)]
    public string? Description { get; init; }

    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    [MaxLength(32)]
    public required string PhoneNumber { get; init; }

    [Range(-90, 90)]
    public double? Latitude { get; init; }

    [Range(-180, 180)]
    public double? Longitude { get; init; }

    [MaxLength(128)]
    public string? City { get; init; }

    [MaxLength(128)]
    public string? Country { get; init; }

    [MaxLength(256)]
    public string? AddressLine1 { get; init; }

    [MaxLength(256)]
    public string? AddressLine2 { get; init; }

    [MaxLength(32)]
    public string? PostalCode { get; init; }
}
