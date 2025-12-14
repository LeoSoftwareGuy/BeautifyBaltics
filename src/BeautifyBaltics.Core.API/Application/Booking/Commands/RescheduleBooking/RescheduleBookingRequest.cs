using System.ComponentModel.DataAnnotations;
using Marten.Schema;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.RescheduleBooking
{
    public record RescheduleBookingRequest
    {
        /// <summary>
        /// Booking ID
        /// </summary>
        [Required] 
        [Identity]
        public Guid BookingId { get; init; }

        /// <summary>
        /// Schedule date and time
        /// </summary>
        [Required]
        public DateTime ScheduledAt { get; init; }

        /// <summary>
        /// Duration of booking
        /// </summary>
        [Required]
        public TimeSpan Duration { get; init; }
    }
}
