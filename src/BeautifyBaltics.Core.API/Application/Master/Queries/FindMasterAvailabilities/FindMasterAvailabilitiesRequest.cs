using BeautifyBaltics.Core.API.Application.SeedWork;
using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterAvailabilities;

public record FindMasterAvailabilitiesRequest : PagedRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }
}
