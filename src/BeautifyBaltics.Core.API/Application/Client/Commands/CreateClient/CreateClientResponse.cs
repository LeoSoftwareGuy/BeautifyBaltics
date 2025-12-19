using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.CreateClient
{
    public record CreateClientResponse(Guid Id)
    {
        /// <summary>
        /// Id
        /// </summary>
        [Required]
        public Guid Id { get; init; } = Id;
    }
}
