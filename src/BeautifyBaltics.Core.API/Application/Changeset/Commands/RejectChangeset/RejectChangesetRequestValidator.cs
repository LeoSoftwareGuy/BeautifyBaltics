using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Changeset.Commands.RejectChangeset
{
    public class RejectChangesetRequestValidator : AbstractValidator<RejectChangesetRequest>
    {
        public RejectChangesetRequestValidator()
        {
            RuleFor(v => v.RejectedById).NotEqual(Guid.Empty);
            RuleFor(v => v.MasterId).NotEqual(Guid.Empty);
            RuleFor(v => v.ChangesetId).NotEqual(Guid.Empty);
        }
    }
}
