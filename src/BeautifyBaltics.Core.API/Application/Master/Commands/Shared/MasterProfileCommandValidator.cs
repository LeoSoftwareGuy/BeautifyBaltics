using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public class MasterProfileCommandValidator : AbstractValidator<MasterProfileCommandDTO>
{
    public MasterProfileCommandValidator()
    {
        RuleFor(v => v.FirstName)
            .NotEmpty()
            .MaximumLength(128);

        RuleFor(v => v.LastName)
            .NotEmpty()
            .MaximumLength(128);

        RuleFor(v => v.Age)
            .InclusiveBetween(18, 120)
            .When(v => v.Age.HasValue);

        RuleFor(v => v.Gender)
            .MaximumLength(64);

        RuleFor(v => v.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(256);

        RuleFor(v => v.PhoneNumber)
            .NotEmpty()
            .MaximumLength(32);
    }
}
