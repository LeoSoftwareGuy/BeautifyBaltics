using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.SeedWork
{
    public record FileContentDTO : FileMetadataDTO
    {
        /// <summary>
        /// Data of generated file
        /// </summary>
        [Required]
        public required byte[] Data { get; init; } = null!;
    }
}
