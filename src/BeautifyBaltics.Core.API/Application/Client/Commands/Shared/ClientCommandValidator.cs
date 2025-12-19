using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.Shared
{
    public class ClientCommandValidator : AbstractValidator<ClientCommandDTO>
    {
        public ClientCommandValidator()
        {
            RuleFor(v => v.FirstName).Length(3, 50);
            RuleFor(v => v.LastName).Length(3, 50);
            RuleFor(v => v.Contacts.Email).EmailAddress();
            RuleFor(v => v.Contacts.PhoneNumber).NotEmpty();
        }
    }
}
