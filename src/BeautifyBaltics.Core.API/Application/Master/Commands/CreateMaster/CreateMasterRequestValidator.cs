using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.CreateMaster;

public class CreateMasterRequestValidator : AbstractValidator<CreateMasterRequest>
{
    public CreateMasterRequestValidator()
    {
        Include(new MasterProfileCommandValidator());
    }
}
