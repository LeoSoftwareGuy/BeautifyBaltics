using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterAvailabilities
{
    public class FindMasterAvailabilitiesRequestValidator : AbstractValidator<FindMasterAvailabilitiesRequest>
    {
        public FindMasterAvailabilitiesRequestValidator()
        {
            RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
            Include(new PagedRequestValidator());
        }
    }
}
