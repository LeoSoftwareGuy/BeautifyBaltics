using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.ResetPassword
{
    public record ResetPasswordRequest
    {
        [Required]
        public required string Token { get; init; }

        [Required]
        public required string NewPassword { get; init; }
    }
}
