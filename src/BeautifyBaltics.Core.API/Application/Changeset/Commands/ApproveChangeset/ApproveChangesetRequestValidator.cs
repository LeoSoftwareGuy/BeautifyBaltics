using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Changeset.Commands.ApproveChangeset
{
    public class ApproveChangesetRequestValidator : AbstractValidator<ApproveChangesetRequest>
    {
        public ApproveChangesetRequestValidator()
        {
            RuleFor(v => v.ApprovedById).NotEqual(Guid.Empty);
            RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
            RuleFor(v => v.ChangesetId).NotEqual(Guid.Empty);
        }
    }
}
