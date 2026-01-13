using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterJob;

public record UpdateMasterJobRequest
{
    [Identity]
    [Required]
    public Guid MasterId { get; init; }

    [Required]
    public Guid MasterJobId { get; init; }

    [Required]
    public MasterJobOfferingCommandDTO Job { get; init; } = null!;
}
