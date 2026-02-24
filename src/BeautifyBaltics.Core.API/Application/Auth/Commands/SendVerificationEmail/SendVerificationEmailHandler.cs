using BeautifyBaltics.Integrations.Notifications.CustomHtmlPlaceholders;
using BeautifyBaltics.Integrations.Notifications.Email;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.SendVerificationEmail
{
    public class SendVerificationEmailHandler(IEmailService emailService)
    {
        public async Task Handle(SendVerificationEmailCommand command, CancellationToken cancellationToken)
        {
            var verificationLink = $"{command.AppUrl}/api/v1/auth/verify-email?token={Uri.EscapeDataString(command.Token)}";

            await emailService.SendHtmlAsync(
                toEmail: command.ToEmail,
                subject: "Verify your BeautifyBaltics account",
                htmlContent: CustomHtml.BuildVerificationEmailHtml(command.FirstName, verificationLink),
                cancellationToken
            );
        }
    }
}
