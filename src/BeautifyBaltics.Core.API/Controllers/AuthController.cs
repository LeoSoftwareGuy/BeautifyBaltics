using System.Security.Claims;
using System.Security.Cryptography;

using BeautifyBaltics.Core.API.Application.Client.Commands.CreateClient;
using BeautifyBaltics.Core.API.Application.Master.Commands.CreateMaster;
using BeautifyBaltics.Core.API.Authentication;
using BeautifyBaltics.Domain.Documents;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Integrations.Notifications.Email;

using JasperFx.Core;

using Marten;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/v1/auth")]
[Tags("Auth")]
public class AuthController(IDocumentSession documentSession, IMessageBus bus, IEmailService emailService, IConfiguration configuration) : ControllerBase
{
    // POST /api/v1/auth/register
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var existingUser = await documentSession.Query<UserAccount>()
            .FirstOrDefaultAsync(x => x.Email == request.Email.ToLowerInvariant(), cancellationToken);

        if (existingUser is not null)
            return Conflict(new { error = "An account with this email already exists." });

        var role = request.Role == "master" ? UserRole.Master : UserRole.Client;
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var userId = CombGuidIdGeneration.NewGuid();

        var userAccount = new UserAccount(userId, request.Email.ToLowerInvariant(), passwordHash, role, request.FirstName, request.LastName, request.PhoneNumber);
        documentSession.Insert(userAccount);

        if (role == UserRole.Client)
        {
            await bus.InvokeAsync<CreateClientResponse>(new CreateClientRequest
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email.ToLowerInvariant(),
                PhoneNumber = request.PhoneNumber,
                UserId = userId
            }, cancellationToken);
        }
        else
        {
            await bus.InvokeAsync<CreateMasterResponse>(new CreateMasterRequest
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email.ToLowerInvariant(),
                PhoneNumber = request.PhoneNumber,
                UserId = userId
            }, cancellationToken);
        }

        var token = GenerateSecureToken();
        var verificationToken = new EmailVerificationToken(CombGuidIdGeneration.NewGuid(), userId, token, DateTimeOffset.UtcNow.AddDays(1));
        documentSession.Insert(verificationToken);

        await documentSession.SaveChangesAsync(cancellationToken);

        var appUrl = GetAppUrl();
        var verificationLink = $"{appUrl}/api/v1/auth/verify-email?token={Uri.EscapeDataString(token)}";
        var html = BuildVerificationEmailHtml(request.FirstName, verificationLink);
        await emailService.SendHtmlAsync(request.Email, "Verify your BeautifyBaltics account", html, cancellationToken);

        return StatusCode(StatusCodes.Status201Created, new { message = "Registration successful. Please check your email to verify your account." });
    }

    // POST /api/v1/auth/login
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var userAccount = await documentSession.Query<UserAccount>()
            .FirstOrDefaultAsync(x => x.Email == request.Email.ToLowerInvariant(), cancellationToken);

        if (userAccount is null || !BCrypt.Net.BCrypt.Verify(request.Password, userAccount.PasswordHash))
            return Unauthorized(new { error = "Invalid email or password." });

        if (!userAccount.EmailVerified)
            return Unauthorized(new { error = "email_not_verified", message = "Please verify your email before logging in." });

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

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30)
        });

        return Ok(new LoginResponse(
            Id: userAccount.Id,
            Email: userAccount.Email,
            Role: userAccount.Role,
            FullName: userAccount.FullName
        ));
    }

    // POST /api/v1/auth/logout
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    // GET /api/v1/auth/verify-email?token=...
    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token, CancellationToken cancellationToken)
    {
        var verificationToken = await documentSession.Query<EmailVerificationToken>()
            .FirstOrDefaultAsync(x => x.Token == token, cancellationToken);

        if (verificationToken is null || !verificationToken.IsValid())
            return BadRequest(new { error = "Invalid or expired verification token." });

        var userAccount = await documentSession.LoadAsync<UserAccount>(verificationToken.UserId, cancellationToken);
        if (userAccount is null)
            return BadRequest(new { error = "User not found." });

        userAccount.SetEmailVerified();
        verificationToken.MarkUsed();

        documentSession.Update(userAccount);
        documentSession.Update(verificationToken);
        await documentSession.SaveChangesAsync(cancellationToken);

        var appUrl = GetAppUrl();
        return Redirect($"{appUrl}/login?verified=true");
    }

    // POST /api/v1/auth/forgot-password
    [HttpPost("forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        var userAccount = await documentSession.Query<UserAccount>()
            .FirstOrDefaultAsync(x => x.Email == request.Email.ToLowerInvariant(), cancellationToken);

        // Always return 200 to prevent email enumeration
        if (userAccount is null)
            return Ok(new { message = "If an account with that email exists, a reset link has been sent." });

        var token = GenerateSecureToken();
        var resetToken = new PasswordResetToken(CombGuidIdGeneration.NewGuid(), userAccount.Id, token, DateTimeOffset.UtcNow.AddHours(2));
        documentSession.Insert(resetToken);
        await documentSession.SaveChangesAsync(cancellationToken);

        var appUrl = GetAppUrl();
        var resetLink = $"{appUrl}/reset-password?token={Uri.EscapeDataString(token)}";
        var html = BuildPasswordResetEmailHtml(userAccount.FirstName, resetLink);
        await emailService.SendHtmlAsync(request.Email, "Reset your BeautifyBaltics password", html, cancellationToken);

        return Ok(new { message = "If an account with that email exists, a reset link has been sent." });
    }

    // POST /api/v1/auth/reset-password
    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var resetToken = await documentSession.Query<PasswordResetToken>()
            .FirstOrDefaultAsync(x => x.Token == request.Token, cancellationToken);

        if (resetToken is null || !resetToken.IsValid())
            return BadRequest(new { error = "Invalid or expired reset token." });

        var userAccount = await documentSession.LoadAsync<UserAccount>(resetToken.UserId, cancellationToken);
        if (userAccount is null)
            return BadRequest(new { error = "User not found." });

        userAccount.UpdatePasswordHash(BCrypt.Net.BCrypt.HashPassword(request.NewPassword));
        resetToken.MarkUsed();

        documentSession.Update(userAccount);
        documentSession.Update(resetToken);
        await documentSession.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Password reset successfully." });
    }

    private string GetAppUrl()
    {
        var configured = configuration["AppUrl"];
        if (!string.IsNullOrWhiteSpace(configured)) return configured.TrimEnd('/');
        return $"{Request.Scheme}://{Request.Host}";
    }

    private static string GenerateSecureToken() =>
        Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');

    private static string BuildVerificationEmailHtml(string firstName, string verificationLink) => $"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi {firstName}, welcome to BeautifyBaltics!</h2>
            <p>Please verify your email address to activate your account.</p>
            <p>
                <a href="{verificationLink}"
                   style="background-color: #e91e8c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Verify Email
                </a>
            </p>
            <p style="color: #666; font-size: 14px;">This link expires in 24 hours. If you did not create an account, please ignore this email.</p>
        </div>
        """;

    private static string BuildPasswordResetEmailHtml(string firstName, string resetLink) => $"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi {firstName}, reset your password</h2>
            <p>We received a request to reset your BeautifyBaltics password.</p>
            <p>
                <a href="{resetLink}"
                   style="background-color: #e91e8c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Reset Password
                </a>
            </p>
            <p style="color: #666; font-size: 14px;">This link expires in 2 hours. If you did not request a password reset, please ignore this email.</p>
        </div>
        """;
}

public record RegisterRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string PhoneNumber,
    string Role
);

public record LoginRequest(string Email, string Password);

public record LoginResponse(Guid Id, string Email, UserRole Role, string FullName);

public record ForgotPasswordRequest(string Email);

public record ResetPasswordRequest(string Token, string NewPassword);
