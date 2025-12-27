using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterProfile;

public record UpdateMasterProfileRequest : MasterProfileCommandDTO
{
    [Required]
    public Guid MasterId { get; init; }
}
