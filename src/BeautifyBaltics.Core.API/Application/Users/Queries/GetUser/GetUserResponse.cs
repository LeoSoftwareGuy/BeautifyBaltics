namespace BeautifyBaltics.Core.API.Application.Users.Queries.UserProfile;

public record GetUserResponse(string Role, string Email, string? FullName);
