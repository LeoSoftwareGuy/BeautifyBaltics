namespace BeautifyBaltics.Integrations.Notifications.Options;

public record SmsOptions
{
    public string ApiKey { get; set; } = string.Empty;
    public string MessagingProfileId { get; set; } = string.Empty;
    public string SenderId { get; set; } = string.Empty;
}