using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.ApproveMasterKyc
{
    public class ApproveMasterKycRequestValidator : AbstractValidator<ApproveMasterKycRequest>
    {
        public ApproveMasterKycRequestValidator()
        {
            RuleFor(v => v.MasterId).NotEqual(Guid.Empty).WithMessage("Master identifier is required.");
            RuleFor(v => v.ApprovedById).NotEqual(Guid.Empty).WithMessage("Approver identifier is required.");
        }
    }
}
