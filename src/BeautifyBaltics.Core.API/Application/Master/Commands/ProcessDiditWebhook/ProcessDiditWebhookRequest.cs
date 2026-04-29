using System.ComponentModel.DataAnnotations;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.ProcessDiditWebhook;

public record ProcessDiditWebhookRequest
{
    [Required]
    [Identity]
    public Guid MasterId { get; init; }

    [Required]
    public required string SessionId { get; init; }

    [Required]
    public required string Status { get; init; }
}
