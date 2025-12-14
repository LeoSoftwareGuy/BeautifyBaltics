using BeautifyBaltics.Core.API.Application.Booking.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.CreateBooking
{
    public class CreateBookingRequestValidator : AbstractValidator<CreateBookingRequest>
    {
        public CreateBookingRequestValidator()
        {
            Include(new BookingCommandValidator());
        }
    }
}
