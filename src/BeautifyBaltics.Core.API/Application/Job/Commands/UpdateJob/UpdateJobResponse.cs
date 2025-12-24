using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Job.Commands.UpdateJob
{
    public record UpdateJobResponse(Guid JobId)
    {
        [Required]
        public Guid JobId { get; init; } = JobId;
    }
}
