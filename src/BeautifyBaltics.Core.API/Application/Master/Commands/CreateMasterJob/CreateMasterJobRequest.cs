using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.AddMasterJob;

public record CreateMasterJobRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Master job command
    /// </summary>
    [Required]
    public MasterJobOfferingCommandDTO Job { get; init; } = null!;
}
