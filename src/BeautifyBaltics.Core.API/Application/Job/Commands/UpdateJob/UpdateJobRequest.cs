using BeautifyBaltics.Core.API.Application.Job.Commands.Shared;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Job.Commands.UpdateJob
{
    public record UpdateJobRequest : JobCommandDTO
    {
        /// <summary>
        /// Job ID
        /// </summary>
        [Required]
        public Guid JobId { get; init; }
    }
}
