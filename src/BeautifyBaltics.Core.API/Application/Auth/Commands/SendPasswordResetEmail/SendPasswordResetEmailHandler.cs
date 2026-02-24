using BeautifyBaltics.Integrations.Notifications.CustomHtmlPlaceholders;
using BeautifyBaltics.Integrations.Notifications.Email;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.SendPasswordResetEmail
{
    public class SendPasswordResetEmailHandler(IEmailService emailService)
    {
        public async Task Handle(SendPasswordResetEmailCommand command, CancellationToken cancellationToken)
        {
            var resetLink = $"{command.AppUrl}/reset-password?token={Uri.EscapeDataString(command.Token)}";

            await emailService.SendHtmlAsync(
                toEmail: command.ToEmail,
                subject: "Reset your BeautifyBaltics password",
                htmlContent: CustomHtml.BuildPasswordResetEmailHtml(command.FirstName, resetLink),
                cancellationToken
            );
        }
    }
}
