using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.SetUserRole;

public record SetUserRoleResponse(Guid Id, UserRole Role);
