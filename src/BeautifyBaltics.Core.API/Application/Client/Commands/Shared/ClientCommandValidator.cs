using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.Shared
{
    public class ClientCommandValidator : AbstractValidator<ClientCommandDTO>
    {
        public ClientCommandValidator()
        {
            RuleFor(v => v.FirstName).Length(3, 50);
            RuleFor(v => v.LastName).Length(3, 50);
            RuleFor(v => v.Email)
                 .NotEmpty()
                 .EmailAddress()
                 .MaximumLength(256);

            RuleFor(v => v.PhoneNumber)
                .NotEmpty()
                .MaximumLength(32);
        }
    }
}
