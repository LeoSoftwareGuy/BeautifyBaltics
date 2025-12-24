using BeautifyBaltics.Core.API.Application.Job.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Job.Commands.UpdateJob
{
    public class UpdateJobRequestValidator : AbstractValidator<UpdateJobRequest>
    {
        public UpdateJobRequestValidator()
        {
            RuleFor(v => v.JobId).NotEqual(Guid.Empty);
            Include(new JobCommandValidator());
        }
    }
}
