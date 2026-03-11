using BeautifyBaltics.Core.API.Authentication.SeedWork;
using BeautifyBaltics.Domain.Aggregates.User;
using BeautifyBaltics.Domain.Aggregates.User.Events;
using BeautifyBaltics.Domain.Documents.User;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections;
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

            var userAccount = await session.Query<UserProjection>()
                .FirstOrDefaultAsync(x => x.Id == verificationToken.UserId, cancellationToken)
                ?? throw DomainException.WithMessage("User not found.");

            verificationToken.MarkUsed();

            session.Events.Append(userAccount.Id, new UserEmailVerified(userAccount.Id, DateTimeOffset.UtcNow));
            session.Update(verificationToken);

            if (userAccount.Role == UserRole.Master)
            {
                var clientAccount = await session.Query<UserProjection>()
                    .FirstOrDefaultAsync(x => x.Email == userAccount.Email && x.Role == UserRole.Client, cancellationToken);

                if (clientAccount is not null && !clientAccount.EmailVerified)
                {
                    session.Events.Append(clientAccount.Id, new UserEmailVerified(clientAccount.Id, DateTimeOffset.UtcNow));
                }
            }

            await session.SaveChangesAsync(cancellationToken);

            var appUrl = Helpers.GetAppUrl(configuration, httpContextAccessor);
            return new VerifyEmailResponse($"{appUrl}/login?verified=true");
        }
    }
}
