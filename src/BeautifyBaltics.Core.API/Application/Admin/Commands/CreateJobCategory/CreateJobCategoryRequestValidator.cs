using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.CreateJobCategory
{
    public class CreateJobCategoryRequestValidator : AbstractValidator<CreateJobCategoryRequest>
    {
        public CreateJobCategoryRequestValidator()
        {
            RuleFor(v => v.Name).NotEmpty().MaximumLength(128);
        }
    }
}
