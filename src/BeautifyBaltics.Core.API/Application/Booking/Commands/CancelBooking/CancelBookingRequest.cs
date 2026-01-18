using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.CancelBooking
{
    public record CancelBookingRequest
    {
        /// <summary>
        /// Booking identifier
        /// </summary>
        [Identity]
        [Required]
        public Guid BookingId { get; init; }

        /// <summary>
        /// Master identifier (if cancelled by master)
        /// </summary>
        public Guid? MasterId { get; init; }

        /// <summary>
        /// Client identifier (if cancelled by client)
        /// </summary>
        public Guid? ClientId { get; init; }
    }
}
