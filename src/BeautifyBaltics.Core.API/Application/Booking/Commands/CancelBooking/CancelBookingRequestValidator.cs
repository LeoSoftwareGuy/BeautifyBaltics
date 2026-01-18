using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.CancelBooking
{
    public class CancelBookingRequestValidator : AbstractValidator<CancelBookingRequest>
    {
        public CancelBookingRequestValidator()
        {
            RuleFor(v => v.BookingId)
                .NotEqual(Guid.Empty)
                .WithMessage("BookingId is required.");

            RuleFor(v => v)
                .Must(v => v.MasterId.HasValue || v.ClientId.HasValue)
                .WithMessage("Either MasterId or ClientId must be provided.");

            When(v => v.MasterId.HasValue, () =>
            {
                RuleFor(v => v.MasterId!.Value)
                    .NotEqual(Guid.Empty)
                    .WithMessage("MasterId cannot be empty when provided.");
            });

            When(v => v.ClientId.HasValue, () =>
            {
                RuleFor(v => v.ClientId!.Value)
                    .NotEqual(Guid.Empty)
                    .WithMessage("ClientId cannot be empty when provided.");
            });
        }
    }
}
