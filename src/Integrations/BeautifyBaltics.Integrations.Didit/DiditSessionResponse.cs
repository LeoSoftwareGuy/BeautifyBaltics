using System.Text.Json.Serialization;

namespace BeautifyBaltics.Integrations.Didit;

public record DiditSessionResponse
{
    [JsonPropertyName("session_id")]
    public required string SessionId { get; init; }

    [JsonPropertyName("url")]
    public required string Url { get; init; }

    [JsonPropertyName("status")]
    public required string Status { get; init; }
}

public record DiditSessionStatusResponse
{
    [JsonPropertyName("session_id")]
    public required string SessionId { get; init; }

    [JsonPropertyName("status")]
    public required string Status { get; init; }
}
