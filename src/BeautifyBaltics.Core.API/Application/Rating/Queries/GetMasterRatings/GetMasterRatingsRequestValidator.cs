using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Rating.Queries.GetMasterRatings
{
    public class GetMasterRatingsRequestValidator : AbstractValidator<GetMasterRatingsRequest>
    {
        public GetMasterRatingsRequestValidator()
        {
            RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
            Include(new PagedRequestValidator());
        }
    }
}
