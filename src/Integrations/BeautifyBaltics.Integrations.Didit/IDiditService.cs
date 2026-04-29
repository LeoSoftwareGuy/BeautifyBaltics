namespace BeautifyBaltics.Integrations.Didit;

public interface IDiditService
{
    Task<DiditSessionResponse> CreateSessionAsync(
        string masterId,
        string callbackUrl,
        string? masterEmail = null,
        CancellationToken cancellationToken = default
    );

    Task<DiditSessionStatusResponse> GetSessionAsync(
        string sessionId,
        CancellationToken cancellationToken = default
    );

    bool VerifyWebhookSignature(string timestamp, string sessionId, string status, string webhookType, string signature);
}
