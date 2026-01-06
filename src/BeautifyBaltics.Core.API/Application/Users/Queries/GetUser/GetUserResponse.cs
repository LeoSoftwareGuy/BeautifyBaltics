using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Users.Queries.UserProfile;

public record GetUserResponse(UserRole Role, string Email, string? FullName);
