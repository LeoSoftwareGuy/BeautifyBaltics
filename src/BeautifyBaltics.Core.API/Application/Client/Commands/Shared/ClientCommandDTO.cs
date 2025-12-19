using BeautifyBaltics.Domain.ValueObjects;
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
        /// Contacts containing phone and email
        /// </summary>
        [Required]
        public required ContactInformation Contacts { get; init; }
    }
}
