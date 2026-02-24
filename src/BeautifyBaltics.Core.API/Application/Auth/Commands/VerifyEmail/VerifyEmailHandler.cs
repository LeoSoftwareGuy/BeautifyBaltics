using BeautifyBaltics.Core.API.Authentication.SeedWork;
using BeautifyBaltics.Domain.Documents.User;
using BeautifyBaltics.Domain.Exceptions;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.VerifyEmail
{
    public class VerifyEmailHandler(
        IDocumentSession session,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor
    )
    {
        public async Task<VerifyEmailResponse> Handle(VerifyEmailRequest request, CancellationToken cancellationToken)
        {
            var verificationToken = await session.Query<EmailVerificationToken>()
                .FirstOrDefaultAsync(x => x.Token == request.Token, cancellationToken);

            if (verificationToken is null || !verificationToken.IsValid()) throw DomainException.WithMessage("Invalid or expired verification token.");

            var userAccount = await session.LoadAsync<User>(verificationToken.UserId, cancellationToken)
                ?? throw DomainException.WithMessage("User not found.");

            userAccount.SetEmailVerified();

            verificationToken.MarkUsed();

            session.Update(userAccount);
            session.Update(verificationToken);
            await session.SaveChangesAsync(cancellationToken);

            var appUrl = Helpers.GetAppUrl(configuration, httpContextAccessor);
            return new VerifyEmailResponse($"{appUrl}/login?verified=true");
        }
    }
}
