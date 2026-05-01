using System.ComponentModel.DataAnnotations;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.InitiateMasterKycVerification;

public record InitiateMasterKycVerificationRequest
{
    [Required]
    [Identity]
    public Guid MasterId { get; init; }
}
