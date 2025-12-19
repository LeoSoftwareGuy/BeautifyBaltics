using BeautifyBaltics.Domain.Enumerations;
using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.UpdateStatusBooking
{
    public record UpdateStatusBookingRequest
    {
       /// <summary>
       /// Booking ID
       /// </summary>
        [Required]
        [Identity]
        public required Guid BookingId { get; init; }

        /// <summary>
        /// Status
        /// </summary>
        [Required]
        public required BookingStatus Status { get; init; }
    }
}
