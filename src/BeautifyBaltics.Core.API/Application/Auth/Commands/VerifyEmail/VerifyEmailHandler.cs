using System.Security.Claims;
using BeautifyBaltics.Core.API.Authentication;
using BeautifyBaltics.Core.API.Authentication.SeedWork;
using BeautifyBaltics.Domain.Aggregates.User;
using BeautifyBaltics.Domain.Aggregates.User.Events;
using BeautifyBaltics.Domain.Documents.User;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections;
using JasperFx.Core;
using Marten;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

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

            var sessionId = CombGuidIdGeneration.NewGuid();
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userAccount.Id.ToString()),
                new(ClaimTypes.Email, userAccount.Email),
                new(ClaimTypes.Role, userAccount.Role.ToString()),
                new(CustomClaimTypes.SessionId, sessionId.ToString()),
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await httpContextAccessor.HttpContext!.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                new AuthenticationProperties { IsPersistent = true, ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30) }
            );

            var appUrl = Helpers.GetAppUrl(configuration, httpContextAccessor);
            var homeUrl = userAccount.Role switch
            {
                UserRole.Admin => $"{appUrl}/admin",
                UserRole.Master => $"{appUrl}/master",
                _ => $"{appUrl}/home",
            };

            return new VerifyEmailResponse(homeUrl);
        }
    }
}
