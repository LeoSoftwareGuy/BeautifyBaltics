using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.AddMasterJob;

public class CreateMasterJobRequestValidator : AbstractValidator<CreateMasterJobRequest>
{
    public CreateMasterJobRequestValidator()
    {
        RuleFor(v => v.MasterId)
            .NotEqual(Guid.Empty);

        RuleFor(v => v.Job)
            .NotNull()
            .SetValidator(new MasterJobOfferingCommandValidator());
    }
}
