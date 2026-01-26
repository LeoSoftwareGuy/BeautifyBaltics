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

        RuleFor(v => v.Latitude)
            .InclusiveBetween(-90, 90)
            .When(v => v.Latitude.HasValue);

        RuleFor(v => v.Longitude)
            .InclusiveBetween(-180, 180)
            .When(v => v.Longitude.HasValue);

        RuleFor(v => v.City)
            .MaximumLength(128)
            .When(v => !string.IsNullOrEmpty(v.City));

        RuleFor(v => v.Country)
            .MaximumLength(128)
            .When(v => !string.IsNullOrEmpty(v.Country));
    }
}
