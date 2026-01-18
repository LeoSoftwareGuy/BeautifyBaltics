using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.ConfirmBooking
{
    public record ConfirmBookingRequest
    {
        /// <summary>
        /// Booking identifier
        /// </summary>
        [Identity]
        [Required]
        public Guid BookingId { get; init; }

        /// <summary>
        /// Master identifier
        /// </summary>
        [Required]
        public required Guid MasterId { get; init; }
    }
}
