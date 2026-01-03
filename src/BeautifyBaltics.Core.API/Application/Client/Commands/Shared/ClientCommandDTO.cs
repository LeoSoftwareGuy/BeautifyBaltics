using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.Shared
{
    public record ClientCommandDTO
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
        [EmailAddress]
        public required string Email { get; init; }

        /// <summary>
        /// Phone number
        /// </summary>
        [Required]
        [MaxLength(32)]
        public required string PhoneNumber { get; init; }
    }
}
