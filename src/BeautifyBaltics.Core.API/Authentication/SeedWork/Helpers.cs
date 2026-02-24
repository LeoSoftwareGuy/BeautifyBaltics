using System.Security.Cryptography;

namespace BeautifyBaltics.Core.API.Authentication.SeedWork
{
    public static class Helpers
    {
        public static string GenerateSecureToken() => Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)).Replace('+', '-').Replace('/', '_').TrimEnd('=');

        public static string GetAppUrl(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            var configured = configuration["AppUrl"];
            if (!string.IsNullOrWhiteSpace(configured)) return configured.TrimEnd('/');

            var httpRequest = httpContextAccessor.HttpContext?.Request;
            if (httpRequest is not null) return $"{httpRequest.Scheme}://{httpRequest.Host}";

            throw new InvalidOperationException("AppUrl configuration is missing.");
        }
    }
}
