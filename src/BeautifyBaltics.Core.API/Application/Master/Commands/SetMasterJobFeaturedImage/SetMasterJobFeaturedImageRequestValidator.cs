using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SetMasterJobFeaturedImage;

public class SetMasterJobFeaturedImageRequestValidator : AbstractValidator<SetMasterJobFeaturedImageRequest>
{
    public SetMasterJobFeaturedImageRequestValidator()
    {
        RuleFor(x => x.MasterId).NotEqual(Guid.Empty);
        RuleFor(x => x.MasterJobId).NotEqual(Guid.Empty);
        RuleFor(x => x.MasterJobImageId)
            .NotNull()
            .WithMessage("Master job image id is required.")
            .NotEqual(Guid.Empty)
            .When(x => x.MasterJobImageId.HasValue);

        RuleFor(x => x.FocusX)
            .InclusiveBetween(0, 1)
            .When(x => x.FocusX.HasValue);

        RuleFor(x => x.FocusY)
            .InclusiveBetween(0, 1)
            .When(x => x.FocusY.HasValue);

        RuleFor(x => x.Zoom)
            .InclusiveBetween(0.4, 3)
            .When(x => x.Zoom.HasValue);
    }
}
