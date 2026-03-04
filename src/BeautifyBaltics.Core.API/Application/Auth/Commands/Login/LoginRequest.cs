using System.ComponentModel.DataAnnotations;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.Login
{
    public record LoginRequest
    {
        /// <summary>
        /// Email identifier
        /// </summary>
        [Required]
        public required string Email { get; init; }

        /// <summary>
        /// Password
        /// </summary>
        [Required]
        public required string Password { get; init; }

        /// <summary>
        /// Role
        /// </summary>
        [Required]
        public required UserRole Role { get; init; }
    }
}
