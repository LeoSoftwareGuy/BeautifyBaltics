using System.Security.Claims;
using BeautifyBaltics.Core.API.Authentication;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Projections;
using JasperFx.Core;
using Marten;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.Login
{
    public class LoginHandler(IQuerySession querySession, IHttpContextAccessor httpContextAccessor)
    {
        // BCrypt is CPU-saturating — cap concurrent verifications so the health check
        // can always get CPU time on a single shared-CPU machine.
        private static readonly SemaphoreSlim _bcryptGate = new(2, 2);

        public async Task<LoginResponse> Handle(LoginRequest request, CancellationToken cancellationToken)
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();

            var userAccount = await querySession.Query<UserProjection>()
                .FirstOrDefaultAsync(x => x.Email == normalizedEmail && x.Role == request.Role, cancellationToken);

            userAccount ??= await querySession.Query<UserProjection>()
                .FirstOrDefaultAsync(x => x.Email == normalizedEmail && x.Role == UserRole.Admin, cancellationToken);

            await _bcryptGate.WaitAsync(cancellationToken);
            bool passwordValid;
            try { passwordValid = await Task.Run(() => BCrypt.Net.BCrypt.Verify(request.Password, userAccount?.PasswordHash ?? string.Empty), cancellationToken); }
            finally { _bcryptGate.Release(); }

            if (userAccount is null || !passwordValid)
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }
               
            if (!userAccount.EmailVerified) throw new UnauthorizedAccessException("email_not_verified");

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
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30)
                }
            );

            return new LoginResponse(userAccount.Id, userAccount.Email, userAccount.Role, userAccount.FullName);
        }
    }
}
