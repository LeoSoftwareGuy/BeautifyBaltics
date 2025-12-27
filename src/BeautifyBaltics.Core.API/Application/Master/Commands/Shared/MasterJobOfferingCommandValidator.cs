using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public class MasterJobOfferingCommandValidator : AbstractValidator<MasterJobOfferingCommandDTO>
{
    public MasterJobOfferingCommandValidator()
    {
        RuleFor(v => v.JobId)
            .NotEmpty();

        RuleFor(v => v.Title)
            .NotEmpty()
            .MaximumLength(256);

        RuleFor(v => v.Price)
            .GreaterThanOrEqualTo(0);

        RuleFor(v => v.DurationMinutes)
            .InclusiveBetween(1, 24 * 60);
    }
}
