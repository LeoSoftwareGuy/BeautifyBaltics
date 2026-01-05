using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterPortfolioFiles
{
    public class FindMasterPortfolioFilesRequestValidator : AbstractValidator<FindMasterPortfolioFilesRequest>
    {
        public FindMasterPortfolioFilesRequestValidator()
        {
            Include(new PagedRequestValidator());
        }
    }
}
