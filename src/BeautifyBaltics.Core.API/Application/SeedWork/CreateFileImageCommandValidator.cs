using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.SeedWork
{
    public class CreateFileImageCommandValidator : AbstractValidator<CreateFileImageCommandDTO>
    {
        public CreateFileImageCommandValidator()
        {
            RuleFor(v => v.Files).NotEmpty();
        }
    }
}
