using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Job.Queries.FindJobs;

public class FindJobsRequestValidator : AbstractValidator<FindJobsRequest>
{
    public FindJobsRequestValidator()
    {
        Include(new PagedRequestValidator());
    }
}
