using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.RejectMasterKyc;

public record RejectMasterKycRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Admin user who rejected
    /// </summary>
    [Required]
    public Guid RejectedById { get; init; }

    /// <summary>
    /// Required reason shown to master
    /// </summary>
    [Required]
    public required string Reason { get; init; }
}
