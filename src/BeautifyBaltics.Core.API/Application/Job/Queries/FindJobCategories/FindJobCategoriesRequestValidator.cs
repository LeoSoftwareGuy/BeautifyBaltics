using BeautifyBaltics.Core.API.Application.Job.Queries.GetJobCategories;
using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Job.Queries.FindJobCategories
{
    public class FindJobCategoriesRequestValidator : AbstractValidator<FindJobCategoriesRequest>
    {
        public FindJobCategoriesRequestValidator()
        {
            Include(new PagedRequestValidator());
        }
    }
}
