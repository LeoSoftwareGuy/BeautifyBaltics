using BeautifyBaltics.Core.API.Application.Job.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Job.Commands.CreateJob;

public class CreateJobRequestValidator : AbstractValidator<CreateJobRequest>
{
    public CreateJobRequestValidator()
    {
       Include(new JobCommandValidator());
    }
}
