using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Client.Queries.Shared
{
    public record ClientDTO
    {
        /// <summary>
        /// ID
        /// </summary>
        [Required]
        public Guid Id { get; init; }

        /// <summary>
        /// First name
        /// </summary>
        [Required]
        public required string FirstName { get; init;  }

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
        /// Phone number
        /// </summary>
        [Required]
        public required string PhoneNumber { get; init; }
    }
}
