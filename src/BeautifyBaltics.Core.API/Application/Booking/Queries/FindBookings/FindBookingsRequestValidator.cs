using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Booking.Queries.FindBookings;

public class FindBookingsRequestValidator : AbstractValidator<FindBookingsRequest>
{
    public FindBookingsRequestValidator()
    {
        Include(new PagedRequestValidator());
    }
}