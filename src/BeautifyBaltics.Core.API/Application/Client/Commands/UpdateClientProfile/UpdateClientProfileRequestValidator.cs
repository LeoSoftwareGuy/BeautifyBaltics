using BeautifyBaltics.Core.API.Application.Client.Commands.Shared;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.UpdateClientProfile
{
    public class UpdateClientProfileRequestValidator : AbstractValidator<UpdateClientProfileRequest>
    {
        public UpdateClientProfileRequestValidator()
        {
            RuleFor(v => v.ClientID).NotEqual(Guid.Empty);
            Include(new ClientCommandValidator());
        }
    }
}
