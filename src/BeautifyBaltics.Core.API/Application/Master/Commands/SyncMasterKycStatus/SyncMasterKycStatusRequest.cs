using System.ComponentModel.DataAnnotations;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SyncMasterKycStatus;

public record SyncMasterKycStatusRequest
{
    [Required]
    [Identity]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Status reported by Didit's callback URL — used directly instead of polling the Didit API.
    /// </summary>
    public string? CallbackStatus { get; init; }
}
