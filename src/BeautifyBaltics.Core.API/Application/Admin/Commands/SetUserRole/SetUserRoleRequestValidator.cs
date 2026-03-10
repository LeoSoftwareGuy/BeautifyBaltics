using BeautifyBaltics.Domain.Enumerations;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.SetUserRole;

public class SetUserRoleRequestValidator : AbstractValidator<SetUserRoleRequest>
{
    public SetUserRoleRequestValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Role).IsInEnum();
    }
}
