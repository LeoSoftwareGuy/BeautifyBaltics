using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterAvailability;

public record GetMasterAvailabilityRequest
{
    [Required]
    [Identity]
    public Guid MasterId { get; init; }

    [Required]
    public Guid MasterAvailabilityId { get; init; }
}
