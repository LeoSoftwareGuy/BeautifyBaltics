using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.AddMasterJob;

public record CreateMasterJobRequest
{
    [Required]
    public Guid MasterId { get; init; }

    [Required]
    public MasterJobOfferingCommandDTO Job { get; init; } = null!;
}
