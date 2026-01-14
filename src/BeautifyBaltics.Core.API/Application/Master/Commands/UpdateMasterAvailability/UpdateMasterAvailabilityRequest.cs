using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterAvailability
{
    public record UpdateMasterAvailabilityRequest
    {
        /// <summary>
        /// Master identifier
        /// </summary>
        [Identity]
        [Required]
        public Guid MasterId { get; init; }

        /// <summary>
        /// Master availability identifier
        /// </summary>
        [Required]
        public Guid MasterAvailabilityId { get; init;  }

        /// <summary>
        /// Master availability slot date and time
        /// </summary>
        [Required]
        public required MasterAvailabilitySlotCommandDTO Availability { get; init;  }
    }
}
