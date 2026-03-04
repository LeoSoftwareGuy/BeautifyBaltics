using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.Login
{
    public record LoginRequest
    {
        [Required]
        public required string Email { get; init; }

        [Required]
        public required string Password { get; init; }

        [Required]
        public required UserRole Role { get; init; }
    }
}
