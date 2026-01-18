using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.ConfirmBooking
{
    public class ConfirmBookingRequestValidator : AbstractValidator<ConfirmBookingRequest>
    {
        public ConfirmBookingRequestValidator()
        {
            RuleFor(v => v.BookingId).NotEqual(Guid.Empty);
            RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
        }
    }
}
