using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.SetUserRole;

public record SetUserRoleRequest(Guid UserId, UserRole Role);
