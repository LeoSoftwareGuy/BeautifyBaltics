using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.SeedWork
{
    public record FileMetadataDTO
    {
        /// <summary>
        /// File name
        /// </summary>
        [Required]
        public required string FileName { get; init; }

        /// <summary>
        /// File mime type
        /// </summary>
        [Required]
        public required string FileMimeType { get; init; }

        /// <summary>
        /// File size
        /// </summary>
        [Required]
        public long FileSize { get; init; }
    }
}
