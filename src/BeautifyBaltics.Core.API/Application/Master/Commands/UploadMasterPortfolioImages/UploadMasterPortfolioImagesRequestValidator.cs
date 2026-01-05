using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterPortfolioImages
{
    public class UploadMasterPortfolioImagesRequestValidator : AbstractValidator<UploadMasterPortfolioImagesRequest>
    {
        public UploadMasterPortfolioImagesRequestValidator()
        {
            RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
            Include(new UploadMasterPortfolioImagesRequestValidator());
        }
    }
}
