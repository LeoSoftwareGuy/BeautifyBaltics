using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetPendingRequests;

public record GetPendingRequestsResponse
{
    /// <summary>
    /// List of pending booking requests
    /// </summary>
    public IReadOnlyList<PendingRequestDTO> Requests { get; init; } = [];

    /// <summary>
    /// Total count of pending requests
    /// </summary>
    [Required]
    public int TotalCount { get; init; }
}

public record PendingRequestDTO
{
    /// <summary>
    /// Booking ID
    /// </summary>
    [Required]
    public Guid Id { get; init; }

    /// <summary>
    /// Client ID
    /// </summary>
    [Required]
    public Guid ClientId { get; init; }

    /// <summary>
    /// Client name
    /// </summary>
    [Required]
    public required string ClientName { get; init; }

    /// <summary>
    /// Service/job title
    /// </summary>
    [Required]
    public required string MasterJobTitle { get; init; }

    /// <summary>
    /// When the booking was requested
    /// </summary>
    [Required]
    public DateTime RequestedAt { get; init; }

    /// <summary>
    /// Scheduled date and time
    /// </summary>
    [Required]
    public DateTime ScheduledAt { get; init; }

    /// <summary>
    /// Service price
    /// </summary>
    [Required]
    public decimal Price { get; init; }
}
