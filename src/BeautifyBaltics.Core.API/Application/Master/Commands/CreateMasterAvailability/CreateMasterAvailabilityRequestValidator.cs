using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DefineAvailability;

public class CreateMasterAvailabilityRequestValidator : AbstractValidator<CreateMasterAvailabilityRequest>
{
    public CreateMasterAvailabilityRequestValidator()
    {
        RuleFor(v => v.MasterId)
            .NotEqual(Guid.Empty);

        RuleFor(v => v.Availability)
            .NotEmpty();

        RuleForEach(v => v.Availability)
            .SetValidator(new MasterAvailabilitySlotValidator());
    }
}
