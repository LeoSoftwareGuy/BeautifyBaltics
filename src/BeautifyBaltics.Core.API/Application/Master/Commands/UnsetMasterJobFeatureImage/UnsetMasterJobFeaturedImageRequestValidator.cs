using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UnsetMasterJobFeatureImage;

public class UnsetMasterJobFeaturedImageRequestValidator : AbstractValidator<UnsetMasterJobFeaturedImageRequest>
{
    public UnsetMasterJobFeaturedImageRequestValidator()
    {
        RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
        RuleFor(v => v.MasterJobId).NotEqual(Guid.Empty);
    }
}
