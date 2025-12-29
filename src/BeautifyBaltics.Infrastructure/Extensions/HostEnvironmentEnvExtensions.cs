using Microsoft.Extensions.Hosting;

namespace BeautifyBaltics.Infrastructure.Extensions
{
    public static class HostEnvironmentEnvExtensions
    {
        public static bool IsIntegrationTesting(this IHostEnvironment hostEnvironment) =>
            hostEnvironment.IsEnvironment("IntegrationTesting");
    }
}
