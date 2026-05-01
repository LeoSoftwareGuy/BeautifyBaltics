using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.UpdateJobCategory;

public class UpdateJobCategoryRequestValidator : AbstractValidator<UpdateJobCategoryRequest>
{
    public UpdateJobCategoryRequestValidator()
    {
        RuleFor(v => v.Id).NotEqual(Guid.Empty);

        RuleFor(v => v.Name)
            .NotEmpty()
            .MaximumLength(128);
    }
}
