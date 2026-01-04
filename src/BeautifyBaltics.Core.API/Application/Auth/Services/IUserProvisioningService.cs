using System.Security.Claims;

namespace BeautifyBaltics.Core.API.Application.Auth.Services;

public interface IUserProvisioningService
{
    Task EnsureProvisionedAsync(ClaimsPrincipal user, CancellationToken cancellationToken);
}
