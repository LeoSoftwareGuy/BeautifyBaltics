using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterJobImage
{
    public class UploadMasterJobImageRequestValidator : AbstractValidator<UploadMasterJobImageRequest>
    {
        public UploadMasterJobImageRequestValidator()
        {
            RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
            RuleFor(v => v.MasterJobId).NotEqual(Guid.Empty);
            Include(new CreateFileImageCommandValidator());
        }
    }
}
