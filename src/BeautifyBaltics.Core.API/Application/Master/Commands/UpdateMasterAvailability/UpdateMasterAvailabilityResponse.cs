using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterAvailability
{
    public record UpdateMasterAvailabilityResponse(Guid MasterId, Guid MasterAvailabilityId)
    {
        /// <summary>
        /// Master identifer
        /// </summary>
        [Required]
        public Guid MasterId { get; init; } = MasterId;

        /// <summary>
        /// Master availability identifier
        /// </summary>
        [Required]
        public Guid MasterAvailabilityId { get; init; } = MasterAvailabilityId;
    }
}
