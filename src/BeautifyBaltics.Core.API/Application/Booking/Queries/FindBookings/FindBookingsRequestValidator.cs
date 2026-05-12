using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Booking.Queries.FindBookings;

public class FindBookingsRequestValidator : AbstractValidator<FindBookingsRequest>
{
    public FindBookingsRequestValidator()
    {
        RuleFor(v => v.ScheduledDateRange)
            .Must(r => r is null || r.Length == 2)
            .WithMessage("ScheduledDateRange must be an array of exactly 2 elements.");

        Include(new PagedRequestValidator());
    }
}