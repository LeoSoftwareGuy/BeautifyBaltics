using BeautifyBaltics.Core.API.Application.Auth.Commands.ForgotPassword;
using BeautifyBaltics.Core.API.Application.Auth.Commands.Login;
using BeautifyBaltics.Core.API.Application.Auth.Commands.RegisterUser;
using BeautifyBaltics.Core.API.Application.Auth.Commands.ResetPassword;
using BeautifyBaltics.Core.API.Application.Auth.Commands.VerifyEmail;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[ApiController]
[AllowAnonymous]
[Route("auth")]
public class AuthController(IMessageBus bus) : ControllerBase
{
    /// <summary>
    /// Register user
    /// </summary>
    /// <param name="request">Register user request</param>
    /// <returns>Status code 201</returns>
    [HttpPost("register", Name = "Register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
    {
        var response = await bus.InvokeAsync<RegisterUserResponse>(request);
        return StatusCode(StatusCodes.Status201Created, new { message = response.Message });
    }

    /// <summary>
    /// Login user
    /// </summary>
    /// <param name="request">Login user request</param>
    /// <returns>Login user response</returns>
    [HttpPost("login", Name = "Login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await bus.InvokeAsync<LoginResponse>(request);
        return Ok(response);
    }

    /// <summary>
    /// Logout user
    /// </summary>
    [HttpPost("logout", Name = "Logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    /// <summary>
    /// Verify email address
    /// </summary>
    /// <param name="token">Verification email token</param>
    /// <returns>Redirects</returns>
    [HttpGet("verify-email", Name = "Verify-email")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token)
    {
        var response = await bus.InvokeAsync<VerifyEmailResponse>(new VerifyEmailRequest { Token = token });
        return Redirect(response.RedirectUrl);
    }

    /// <summary>
    /// Forgot password
    /// </summary>
    /// <param name="request">Forgot password request</param>
    [HttpPost("forgot-password", Name = "Forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var response = await bus.InvokeAsync<ForgotPasswordResponse>(request);
        return Ok(new { message = response.Message });
    }

    /// <summary>
    /// Reset password
    /// </summary>
    /// <param name="request">Reset request</param>
    [HttpPost("reset-password", Name = "Reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var response = await bus.InvokeAsync<ResetPasswordResponse>(request);
        return Ok(new { message = response.Message });
    }
}
