using BeautifyBaltics.Integrations.Notifications.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace BeautifyBaltics.Integrations.Notifications.Email;

public class SendGridEmailService : IEmailService
{
    private readonly EmailOptions _options;
    private readonly ILogger<SendGridEmailService> _logger;
    private readonly SendGridClient? _client;

    public SendGridEmailService(
        IOptions<EmailOptions> options,
        ILogger<SendGridEmailService> logger
    )
    {
        _options = options.Value;
        _logger = logger;

        if (!string.IsNullOrEmpty(_options.ApiKey))
        {
            _client = new SendGridClient(_options.ApiKey);
        }
    }

    public async Task<bool> SendWithTemplateAsync(
        string toEmail,
        string templateId,
        object templateData,
        CancellationToken cancellationToken = default
    )
    {
        if (!_options.Enabled)
        {
            _logger.LogInformation("Email service is disabled, skipping email to {ToEmail}", toEmail);
            return true;
        }

        if (_client is null)
        {
            _logger.LogWarning("SendGrid client not configured, cannot send email to {ToEmail}", toEmail);
            return false;
        }

        if (string.IsNullOrWhiteSpace(toEmail))
        {
            _logger.LogWarning("Cannot send email: recipient address is empty");
            return false;
        }

        if (string.IsNullOrWhiteSpace(templateId))
        {
            _logger.LogWarning("Cannot send email: template ID is empty");
            return false;
        }

        try
        {
            var from = new EmailAddress(_options.FromEmail, _options.FromName);
            var to = new EmailAddress(toEmail);

            var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, templateData);

            var response = await _client.SendEmailAsync(msg, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation(
                    "Email sent successfully to {ToEmail} using template {TemplateId}",
                    toEmail,
                    templateId);
                return true;
            }

            var responseBody = await response.Body.ReadAsStringAsync(cancellationToken);
            _logger.LogError(
                "Failed to send email to {ToEmail}. Status: {StatusCode}, Body: {ResponseBody}",
                toEmail,
                response.StatusCode,
                responseBody);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {ToEmail}", toEmail);
            return false;
        }
    }
}
