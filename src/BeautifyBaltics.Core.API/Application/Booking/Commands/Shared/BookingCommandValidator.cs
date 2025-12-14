using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.Shared
{
    public class BookingCommandValidator : AbstractValidator<BookingCommandDTO>
    {
        public BookingCommandValidator()
        {
            RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
            RuleFor(v => v.ClientId).NotEqual(Guid.Empty);
            RuleFor(v => v.MasterJobId).NotEqual(Guid.Empty);
            RuleFor(v => v.DurationMinutes).GreaterThan(0);
            RuleFor(v => v.ScheduledAt).GreaterThanOrEqualTo(DateTime.Now);
            RuleFor(v => v.Price).GreaterThan(0);
        }
    }
}
