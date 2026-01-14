using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterAvailability
{
    public class UpdateMasterAvailabilityRequestValidator : AbstractValidator<UpdateMasterAvailabilityRequest>
    {
        public UpdateMasterAvailabilityRequestValidator()
        {
            RuleFor(v => v.MasterAvailabilityId).NotEqual(Guid.Empty);

            RuleFor(v => v.Availability)
                .SetValidator(new MasterAvailabilitySlotValidator());
        }
    }
}
