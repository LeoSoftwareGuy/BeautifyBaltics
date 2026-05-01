namespace BeautifyBaltics.Integrations.Didit;

public record DiditOptions
{
    public const string SectionName = "Didit";

    public string ApiKey { get; set; } = string.Empty;
    public string WorkflowId { get; set; } = string.Empty;
    public string WebhookSecretKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://verification.didit.me";
}
