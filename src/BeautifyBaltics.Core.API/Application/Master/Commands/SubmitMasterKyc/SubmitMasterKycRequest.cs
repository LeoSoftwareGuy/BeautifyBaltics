using BeautifyBaltics.Core.API.Application.SeedWork;
using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SubmitMasterKyc;

public record SubmitMasterKycRequest : CreateFileImageCommandDTO
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }
}
