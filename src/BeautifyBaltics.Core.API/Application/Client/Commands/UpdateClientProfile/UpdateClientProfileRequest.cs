using BeautifyBaltics.Core.API.Application.Client.Commands.Shared;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.UpdateClientProfile
{
    public record UpdateClientProfileRequest : ClientCommandDTO
    {
        /// <summary>
        /// Client id
        /// </summary>
        [Required]
        public Guid ClientID { get; init; }
    }
}
