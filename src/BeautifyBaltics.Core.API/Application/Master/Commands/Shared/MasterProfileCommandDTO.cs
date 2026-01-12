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
}
