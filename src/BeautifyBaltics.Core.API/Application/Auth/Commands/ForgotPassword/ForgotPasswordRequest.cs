using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.ForgotPassword
{
    public record ForgotPasswordRequest
    {
        [Required]
        public required string Email { get; init; }
    }
}
