using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SetMasterJobFeaturedImage;

public class SetMasterJobFeaturedImageRequestValidator : AbstractValidator<SetMasterJobFeaturedImageRequest>
{
    public SetMasterJobFeaturedImageRequestValidator()
    {
        RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
        RuleFor(v => v.MasterJobId).NotEqual(Guid.Empty);
        RuleFor(v => v.MasterJobImageId)
            .NotNull()
            .WithMessage("Master job image id is required.")
            .NotEqual(Guid.Empty)
            .When(v => v.MasterJobImageId.HasValue);

        RuleFor(v => v.FocusX)
            .InclusiveBetween(0, 1)
            .When(v => v.FocusX.HasValue);

        RuleFor(v => v.FocusY)
            .InclusiveBetween(0, 1)
            .When(v => v.FocusY.HasValue);

        RuleFor(v => v.Zoom)
            .InclusiveBetween(0.4, 3)
            .When(x => x.Zoom.HasValue);
    }
}
