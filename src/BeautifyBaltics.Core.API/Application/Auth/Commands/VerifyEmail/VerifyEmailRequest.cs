using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.VerifyEmail
{
    public record VerifyEmailRequest
    {
        [Required]
        public required string Token { get; init; }
    }
}
