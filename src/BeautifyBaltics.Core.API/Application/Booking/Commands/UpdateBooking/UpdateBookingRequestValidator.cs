using BeautifyBaltics.Core.API.Application.Booking.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.UpdateBooking;

public class UpdateBookingRequestValidator : AbstractValidator<UpdateBookingRequest>
{
    public UpdateBookingRequestValidator()
    {
        RuleFor(v => v.BookingId).NotEqual(Guid.Empty);
        Include(new BookingCommandValidator());
    }
}