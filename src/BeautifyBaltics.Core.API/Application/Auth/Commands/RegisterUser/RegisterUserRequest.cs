using BeautifyBaltics.Domain.Enumerations;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.RegisterUser
{
    public record RegisterUserRequest
    {
        [Required]
        public required string FirstName { get; init; }

        [Required]
        public required string LastName { get; init; }

        [Required]
        public required string Email { get; init; }

        [Required]
        public required string Password { get; init; }

        [Required]
        public required string PhoneNumber { get; init; }

        [Required]
        public required UserRole Role { get; init; }
    }
}
