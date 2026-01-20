namespace BeautifyBaltics.Integrations.Notifications.Email;

public interface IEmailService
{
    Task<bool> SendWithTemplateAsync(
        string toEmail,
        string templateId,
        object templateData,
        CancellationToken cancellationToken = default
    );
}
