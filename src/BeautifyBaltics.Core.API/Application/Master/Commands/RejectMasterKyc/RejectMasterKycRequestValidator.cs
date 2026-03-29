using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.RejectMasterKyc
{
    public class RejectMasterKycRequestValidator : AbstractValidator<RejectMasterKycRequest>
    {
        public RejectMasterKycRequestValidator()
        {
            RuleFor(v => v.MasterId).NotEmpty().WithMessage("Master identifier is required.");
            RuleFor(v => v.RejectedById).NotEmpty().WithMessage("Rejected by identifier is required.");
            RuleFor(v => v.Reason)
                .NotEmpty()
                .WithMessage("Rejection reason is required.")
                .Length(5, 200)
                .WithMessage("Length can be from 5 till 200 characters");
        }
    }
}
