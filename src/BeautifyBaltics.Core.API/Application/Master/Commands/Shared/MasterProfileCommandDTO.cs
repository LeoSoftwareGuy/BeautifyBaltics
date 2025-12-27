using System.ComponentModel.DataAnnotations;

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

    [MaxLength(64)]
    public string? Gender { get; init; }

    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    [MaxLength(32)]
    public required string PhoneNumber { get; init; }
}
