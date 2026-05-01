using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.ApproveMasterKyc;

public record ApproveMasterKycRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Admin user who approved
    /// </summary>
    [Required]
    public Guid ApprovedById { get; init; }
}
