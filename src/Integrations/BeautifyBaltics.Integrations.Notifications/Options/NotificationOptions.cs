namespace BeautifyBaltics.Integrations.Notifications.Options;

public record NotificationOptions
{
    public const string SectionName = "Notifications";
    public SmsOptions Sms { get; set; } = new();
    public EmailOptions Email { get; set; } = new();
}
