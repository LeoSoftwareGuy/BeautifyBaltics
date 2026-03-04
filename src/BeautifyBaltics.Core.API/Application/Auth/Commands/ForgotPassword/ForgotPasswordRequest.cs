using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.ForgotPassword
{
    public record ForgotPasswordRequest
    {
        [Required]
        public required string Email { get; init; }

        [Required]
        public required UserRole Role { get; init; }
    }
}
