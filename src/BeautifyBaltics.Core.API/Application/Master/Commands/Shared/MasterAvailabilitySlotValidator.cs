using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public class MasterAvailabilitySlotValidator : AbstractValidator<MasterAvailabilitySlotCommandDTO>
{
    public MasterAvailabilitySlotValidator()
    {
        RuleFor(v => v.Start)
            .NotEmpty();

        RuleFor(v => v.End)
            .NotEmpty()
            .GreaterThan(v => v.Start);
    }
}
