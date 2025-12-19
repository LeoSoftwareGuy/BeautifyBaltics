using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.UpdateStatusBooking
{
    public class UpdateStatusBookingRequestValidator : AbstractValidator<UpdateStatusBookingRequest>
    {
        public UpdateStatusBookingRequestValidator()
        {
            RuleFor(v => v.BookingId).NotEqual(Guid.Empty);
        }
    }
}
