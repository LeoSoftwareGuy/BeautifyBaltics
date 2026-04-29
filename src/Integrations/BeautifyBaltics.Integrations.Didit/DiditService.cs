using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BeautifyBaltics.Integrations.Didit;

public class DiditService(
    IHttpClientFactory httpClientFactory,
    IOptions<DiditOptions> options,
    ILogger<DiditService> logger
) : IDiditService
{
    private readonly DiditOptions _options = options.Value;

    public async Task<DiditSessionResponse> CreateSessionAsync(
        string masterId,
        string callbackUrl,
        string? masterEmail = null,
        CancellationToken cancellationToken = default
    )
    {
        var client = httpClientFactory.CreateClient(nameof(DiditService));

        var body = new Dictionary<string, object>
        {
            ["workflow_id"] = _options.WorkflowId,
            ["vendor_data"] = masterId,
            ["callback"] = callbackUrl,
        };

        if (!string.IsNullOrWhiteSpace(masterEmail)) body["contact_details"] = new { email = masterEmail };

        var response = await client.PostAsJsonAsync("/v3/session/", body, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);
            logger.LogError("Didit session creation failed: {StatusCode} {Error}", response.StatusCode, error);
            throw new InvalidOperationException($"Didit session creation failed: {response.StatusCode} — {error}");
        }

        var result = await response.Content.ReadFromJsonAsync<DiditSessionResponse>(cancellationToken: cancellationToken);

        return result ?? throw new InvalidOperationException("Didit returned an empty session response.");
    }

    public async Task<DiditSessionStatusResponse> GetSessionAsync(
        string sessionId,
        CancellationToken cancellationToken = default
    )
    {
        var client = httpClientFactory.CreateClient(nameof(DiditService));

        var response = await client.GetAsync($"/v3/session/{sessionId}/decision/", cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);
            logger.LogError("Didit session fetch failed: {StatusCode} {Error}", response.StatusCode, error);
            throw new HttpRequestException($"Didit session fetch failed: {response.StatusCode} — {error}", null, response.StatusCode);
        }

        var result = await response.Content.ReadFromJsonAsync<DiditSessionStatusResponse>(cancellationToken: cancellationToken);

        return result ?? throw new HttpRequestException("Didit returned an empty session response.");
    }

    public bool VerifyWebhookSignature(string timestamp, string sessionId, string status, string webhookType, string signature)
    {
        if (string.IsNullOrWhiteSpace(_options.WebhookSecretKey))
        {
            logger.LogWarning("Didit webhook secret key is not configured — skipping signature verification.");
            return true;
        }

        var payload = $"{timestamp}:{sessionId}:{status}:{webhookType}";
        var key = Encoding.UTF8.GetBytes(_options.WebhookSecretKey);
        var data = Encoding.UTF8.GetBytes(payload);

        using var hmac = new HMACSHA256(key);
        var computed = Convert.ToHexString(hmac.ComputeHash(data)).ToLowerInvariant();

        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(computed),
            Encoding.UTF8.GetBytes(signature.ToLowerInvariant())
        );
    }
}
