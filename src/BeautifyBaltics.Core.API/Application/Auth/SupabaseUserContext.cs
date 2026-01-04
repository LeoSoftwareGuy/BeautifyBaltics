using System.Security.Claims;
using System.Text.Json;
using BeautifyBaltics.Domain.Enumerations;

namespace BeautifyBaltics.Core.API.Application.Auth;

public sealed record SupabaseUserContext(
    string SupabaseUserId,
    string Email,
    string FirstName,
    string LastName,
    string PhoneNumber,
    UserRole Role
)
{
    private const string UserMetadataClaim = "user_metadata";

    public static SupabaseUserContext? FromClaims(ClaimsPrincipal user, ILogger? logger = null)
    {
        var supabaseId = user.FindFirstValue("sub")
            ?? user.FindFirstValue(ClaimTypes.Email)
            ?? user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(supabaseId)) return null;

        var email = user.FindFirstValue(ClaimTypes.Email)
                    ?? user.FindFirstValue("email")
                    ?? string.Empty;

        var metadataClaim = user.FindFirst(UserMetadataClaim)?.Value;
        if (string.IsNullOrWhiteSpace(metadataClaim))
        {
            logger?.LogWarning("Supabase user metadata claim is missing for user {SupabaseUserId}", supabaseId);
            return null;
        }

        try
        {
            using var document = JsonDocument.Parse(metadataClaim);
            var root = document.RootElement;

            var firstName = root.TryGetProperty("firstName", out var firstNameElement)
                ? firstNameElement.GetString()
                : null;
            var lastName = root.TryGetProperty("lastName", out var lastNameElement)
                ? lastNameElement.GetString()
                : null;
            var phoneNumber = root.TryGetProperty("phoneNumber", out var phoneElement)
                ? phoneElement.GetString()
                : null;
            var role = root.TryGetProperty("role", out var roleElement)
                ? roleElement.GetString()
                : null;

            if (string.IsNullOrWhiteSpace(firstName) ||
                string.IsNullOrWhiteSpace(lastName) ||
                string.IsNullOrWhiteSpace(phoneNumber))
            {
                logger?.LogWarning(
                    "Supabase metadata for user {SupabaseUserId} is missing required profile information",
                    supabaseId);
                return null;
            }

            var resolvedRole = string.Equals(role, "master", StringComparison.OrdinalIgnoreCase)
                ? UserRole.Master
                : UserRole.Client;

            return new SupabaseUserContext(
                supabaseId,
                email,
                firstName,
                lastName,
                phoneNumber,
                resolvedRole
            );
        }
        catch (JsonException ex)
        {
            logger?.LogWarning(ex, "Failed to parse Supabase metadata for user {SupabaseUserId}", supabaseId);
            return null;
        }
    }
}
