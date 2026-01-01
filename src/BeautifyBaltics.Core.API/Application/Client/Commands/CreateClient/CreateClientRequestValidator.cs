using BeautifyBaltics.Core.API.Application.Client.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.CreateClient
{
    public class CreateClientRequestValidator : AbstractValidator<CreateClientRequest>
    {
        public CreateClientRequestValidator()
        {
            Include(new ClientCommandValidator());
            RuleFor(v => v.SupabaseUserId).NotEmpty();
        }
    }
}
