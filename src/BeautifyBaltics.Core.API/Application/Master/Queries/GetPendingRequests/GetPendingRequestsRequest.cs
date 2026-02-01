using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetPendingRequests;

public record GetPendingRequestsRequest
{
    [Required]
    public Guid MasterId { get; init; }
}
