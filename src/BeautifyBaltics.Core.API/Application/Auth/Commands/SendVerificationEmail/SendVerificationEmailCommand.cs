namespace BeautifyBaltics.Core.API.Application.Auth.Commands.SendVerificationEmail
{
    public record SendVerificationEmailCommand(
        string ToEmail,
        string FirstName,
        string Token,
        string AppUrl
    );
}
