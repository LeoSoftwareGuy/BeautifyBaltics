using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Job.Commands.Shared
{
    public class JobCommandValidator : AbstractValidator<JobCommandDTO>
    {
        public JobCommandValidator()
        {
            RuleFor(v => v.Name)
                 .NotEmpty()
                 .MaximumLength(256);

            RuleFor(v => v.CategoryId)
                .NotEqual(Guid.Empty);

            RuleFor(v => v.Description)
                .NotEmpty()
                .MaximumLength(500);

            RuleFor(v => v.DurationMinutes)
                .GreaterThan(0)
                .LessThanOrEqualTo(24 * 60);
        }
    }
}
