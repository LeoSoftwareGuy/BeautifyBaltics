using System.Text.Json.Serialization;

namespace BeautifyBaltics.Integrations.Didit;

public record DiditWebhookPayload
{
    [JsonPropertyName("session_id")]
    public required string SessionId { get; init; }

    [JsonPropertyName("status")]
    public required string Status { get; init; }

    [JsonPropertyName("webhook_type")]
    public required string WebhookType { get; init; }

    [JsonPropertyName("timestamp")]
    public required long Timestamp { get; init; }

    [JsonPropertyName("vendor_data")]
    public required string? VendorData { get; init; }
}

public static class DiditVerificationStatus
{
    public const string Approved = "Approved";
    public const string Declined = "Declined";
    public const string Abandoned = "Abandoned";
    public const string Expired = "Expired";
    public const string InProgress = "In Progress";
    public const string InReview = "In Review";
    public const string NotStarted = "Not Started";
}
