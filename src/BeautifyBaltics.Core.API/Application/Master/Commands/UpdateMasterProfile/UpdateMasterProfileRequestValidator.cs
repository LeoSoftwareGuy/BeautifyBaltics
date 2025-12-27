using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterProfile;

public class UpdateMasterProfileRequestValidator : AbstractValidator<UpdateMasterProfileRequest>
{
    public UpdateMasterProfileRequestValidator()
    {
        Include(new MasterProfileCommandValidator());

        RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
    }
}
