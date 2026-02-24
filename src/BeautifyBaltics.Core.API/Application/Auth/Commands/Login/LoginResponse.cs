using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.Login
{
    public record LoginResponse(Guid Id, string Email, UserRole Role, string FullName);
}
