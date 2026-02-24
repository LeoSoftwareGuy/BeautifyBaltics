namespace BeautifyBaltics.Core.API.Application.Auth.Commands.SendPasswordResetEmail
{
    public record SendPasswordResetEmailCommand(
        string ToEmail,
        string FirstName,
        string Token,
        string AppUrl
    );
}
