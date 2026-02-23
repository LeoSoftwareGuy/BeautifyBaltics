namespace BeautifyBaltics.Integrations.Notifications.Email;

public interface IEmailService
{
    Task<bool> SendWithTemplateAsync(
        string toEmail,
        string templateId,
        object templateData,
        CancellationToken cancellationToken = default
    );

    Task<bool> SendHtmlAsync(
        string toEmail,
        string subject,
        string htmlContent,
        CancellationToken cancellationToken = default
    );
}
