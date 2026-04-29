using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace BeautifyBaltics.Integrations.Didit;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDiditIntegration(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<DiditOptions>(configuration.GetSection(DiditOptions.SectionName));

        services.AddHttpClient(nameof(DiditService), (sp, client) =>
        {
            var options = sp.GetRequiredService<IOptions<DiditOptions>>().Value;
            client.BaseAddress = new Uri(options.BaseUrl);
            client.DefaultRequestHeaders.Add("x-api-key", options.ApiKey);
        });

        services.AddSingleton<IDiditService, DiditService>();

        return services;
    }
}
