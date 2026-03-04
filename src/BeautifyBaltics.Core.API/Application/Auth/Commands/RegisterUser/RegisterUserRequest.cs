using BeautifyBaltics.Domain.Enumerations;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.RegisterUser
{
    public record RegisterUserRequest
    {
        /// <summary>
        /// First name
        /// </summary>
        [Required]
        public required string FirstName { get; init; }

        /// <summary>
        /// Last name
        /// </summary>
        [Required]
        public required string LastName { get; init; }

        /// <summary>
        /// Email address
        /// </summary>
        [Required]
        public required string Email { get; init; }

        /// <summary>
        /// Password
        /// </summary>
        [Required]
        public required string Password { get; init; }

        /// <summary>
        /// Phone number
        /// </summary>
        [Required]
        public required string PhoneNumber { get; init; }

        /// <summary>
        /// Role
        /// </summary>
        [Required]
        public required UserRole Role { get; init; }
    }
}
