using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.UpdateClientProfile
{
    public record UpdateClientProfileResponse(Guid Id)
    {
        /// <summary>
        /// Id
        /// </summary>
        [Required]
        public Guid Id { get; init; } = Id;
    }
}
