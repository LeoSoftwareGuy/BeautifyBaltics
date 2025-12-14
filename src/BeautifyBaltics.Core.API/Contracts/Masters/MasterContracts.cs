using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Contracts.Masters;

public record MasterJobPayload
{
    [Required]
    public Guid JobId { get; init; }

    [Required]
    public string Title { get; init; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Price { get; init; }

    [Range(1, 24 * 60)]
    public int DurationMinutes { get; init; }
}

public record AvailabilitySlotPayload
{
    [Required]
    public DateTime Start { get; init; }

    [Required]
    public DateTime End { get; init; }
}

public record CreateMasterRequest
{
    [Required]
    public string FirstName { get; init; } = string.Empty;

    [Required]
    public string LastName { get; init; } = string.Empty;

    public int? Age { get; init; }

    public string? Gender { get; init; }

    [Required, EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    public string PhoneNumber { get; init; } = string.Empty;

    public List<MasterJobPayload> Jobs { get; init; } = new();
    public List<AvailabilitySlotPayload> Availability { get; init; } = new();
}

public record UpdateMasterProfileRequest : CreateMasterRequest;

public record AddMasterJobRequest
{
    [Required]
    public MasterJobPayload Job { get; init; } = new();
}

public record DefineAvailabilityRequest
{
    public List<AvailabilitySlotPayload> Availability { get; init; } = new();
}

public record MasterResponse
{
    public Guid Id { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public int? Age { get; init; }
    public string? Gender { get; init; }
    public string Email { get; init; } = string.Empty;
    public string PhoneNumber { get; init; } = string.Empty;
    public IEnumerable<MasterJobPayload> Jobs { get; init; } = Array.Empty<MasterJobPayload>();
    public IEnumerable<AvailabilitySlotPayload> Availability { get; init; } = Array.Empty<AvailabilitySlotPayload>();
}
