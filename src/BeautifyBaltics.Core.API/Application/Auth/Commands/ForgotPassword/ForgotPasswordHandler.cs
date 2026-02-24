using BeautifyBaltics.Core.API.Application.Auth.Commands.SendPasswordResetEmail;
using BeautifyBaltics.Core.API.Authentication.SeedWork;
using BeautifyBaltics.Domain.Documents.User;
using JasperFx.Core;
using Marten;
using Wolverine;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.ForgotPassword
{
    public class ForgotPasswordHandler(
        IDocumentSession session,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor
    )
    {
        private const string GenericMessage = "If an account with that email exists, a reset link has been sent.";

        public async Task<(ForgotPasswordResponse, OutgoingMessages)> Handle(ForgotPasswordRequest request, CancellationToken cancellationToken)
        {
            var outgoing = new OutgoingMessages();

            var userAccount = await session.Query<User>()
                .FirstOrDefaultAsync(x => x.Email == request.Email.ToLowerInvariant(), cancellationToken);

            // Always return success to prevent email enumeration
            if (userAccount is null) return (new ForgotPasswordResponse(GenericMessage), outgoing);

            var token = Helpers.GenerateSecureToken();
            var resetToken = new PasswordResetToken(
                id: CombGuidIdGeneration.NewGuid(),
                userId: userAccount.Id,
                token: token,
                expiresAt: DateTimeOffset.UtcNow.AddHours(2)
            );

            session.Insert(resetToken);
            await session.SaveChangesAsync(cancellationToken);

            var appUrl = Helpers.GetAppUrl(configuration, httpContextAccessor);
            outgoing.Add(new SendPasswordResetEmailCommand(userAccount.Email, userAccount.FirstName, token, appUrl));

            return (new ForgotPasswordResponse(GenericMessage), outgoing);
        }
    }
}
