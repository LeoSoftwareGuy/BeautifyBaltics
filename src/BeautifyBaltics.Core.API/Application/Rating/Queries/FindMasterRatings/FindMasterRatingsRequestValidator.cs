using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Rating.Queries.FindMasterRatings
{
    public class FindMasterRatingsRequestValidator : AbstractValidator<FindMasterRatingsRequest>
    {
        public FindMasterRatingsRequestValidator()
        {
            Include(new PagedRequestValidator());
        }
    }
}
