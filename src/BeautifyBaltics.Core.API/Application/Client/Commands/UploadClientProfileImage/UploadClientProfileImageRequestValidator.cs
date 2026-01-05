using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.UploadClientProfileImage
{
    public class UploadClientProfileImageRequestValidator : AbstractValidator<UploadClientProfileImageRequest>
    {
        public UploadClientProfileImageRequestValidator()
        {
            RuleFor(v => v.ClientId).NotEqual(Guid.Empty);
            Include(new CreateFileImageCommandValidator());
        }
    }
}
