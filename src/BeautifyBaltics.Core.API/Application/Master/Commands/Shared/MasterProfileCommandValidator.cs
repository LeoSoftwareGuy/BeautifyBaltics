using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public class MasterProfileCommandValidator : AbstractValidator<MasterProfileCommandDTO>
{
    public MasterProfileCommandValidator()
    {
        RuleFor(v => v.FirstName).Length(3, 50);
        RuleFor(v => v.LastName).Length(3, 50);

        RuleFor(v => v.Age)
            .InclusiveBetween(5, 120)
            .When(v => v.Age.HasValue);

        RuleFor(v => v.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(256);

        RuleFor(v => v.PhoneNumber)
            .NotEmpty()
            .MaximumLength(32);
    }
}
