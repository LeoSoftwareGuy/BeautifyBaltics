using BeautifyBaltics.Core.API.Application.Master.Commands.ProcessDiditWebhook;
using BeautifyBaltics.Integrations.Didit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[AllowAnonymous]
[Route("webhooks/didit")]
public class DiditWebhooksController(
    IMessageBus bus,
    IDiditService diditService,
    ILogger<DiditWebhooksController> logger
) : ControllerBase
{
    /// <summary>
    /// Receive Didit verification status webhook
    /// </summary>
    [HttpPost(Name = "DiditWebhook")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Receive(
        [FromBody] DiditWebhookPayload payload,
        [FromHeader(Name = "X-Timestamp")] string? timestamp,
        [FromHeader(Name = "X-Signature-Simple")] string? signature,
        CancellationToken cancellationToken
    )
    {
        if (!string.IsNullOrWhiteSpace(signature) && !string.IsNullOrWhiteSpace(timestamp))
        {
            var isValid = diditService.VerifyWebhookSignature(
                timestamp, payload.SessionId, payload.Status, payload.WebhookType, signature
            );

            if (!isValid)
            {
                logger.LogWarning("Didit webhook signature invalid for session {SessionId}", payload.SessionId);
                return Unauthorized();
            }
        }

        // Only process terminal status updates
        if (payload.WebhookType != "status.updated") return Ok();

        if (string.IsNullOrWhiteSpace(payload.VendorData) || !Guid.TryParse(payload.VendorData, out var masterId))
        {
            logger.LogWarning("Didit webhook missing or invalid vendor_data: {VendorData}", payload.VendorData);
            return Ok();
        }

        logger.LogInformation(
            "Didit webhook received: master {MasterId}, session {SessionId}, status {Status}",
            masterId, payload.SessionId, payload.Status
        );

        await bus.InvokeAsync(new ProcessDiditWebhookRequest
        {
            MasterId = masterId,
            SessionId = payload.SessionId,
            Status = payload.Status,
        }, cancellationToken);

        return Ok();
    }
}
