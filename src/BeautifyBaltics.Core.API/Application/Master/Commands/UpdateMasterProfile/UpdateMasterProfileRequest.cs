using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterProfile;

public record UpdateMasterProfileRequest : MasterProfileCommandDTO
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }
}
