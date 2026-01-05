using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.SeedWork
{
    public record CreateFileImageCommandDTO
    {
        /// <summary>
        /// File uploads
        /// </summary>
        [Required]
        [FromForm]
        public required List<IFormFile> Files { get; init; }
    }
}
