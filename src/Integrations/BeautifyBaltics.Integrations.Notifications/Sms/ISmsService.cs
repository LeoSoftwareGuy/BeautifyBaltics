namespace BeautifyBaltics.Integrations.Notifications.Sms;

public interface ISmsService
{
    Task<bool> SendSmsAsync(string toPhoneNumber, string message);
    Task<bool> SendSmsAsync(string toPhoneNumber, string message, string? mediaUrl);
}
