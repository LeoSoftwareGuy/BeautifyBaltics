using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterProfileImage
{
    public class UploadMasterProfileImageRequestValidator : AbstractValidator<UploadMasterProfileImageRequest>
    {
        public UploadMasterProfileImageRequestValidator()
        {
            RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
            Include(new CreateFileImageCommandValidator());
        }
    }
}
