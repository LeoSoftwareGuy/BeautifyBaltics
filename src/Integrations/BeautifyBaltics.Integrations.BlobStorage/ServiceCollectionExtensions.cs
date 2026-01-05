using Microsoft.Extensions.DependencyInjection;

namespace BeautifyBaltics.Integrations.BlobStorage
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBlobStorageIntegration(
            this IServiceCollection services,
            Action<IBlobStorageConfigurator>? configure = null)
        {
            services.AddScoped(typeof(IBlobStorageService<>), typeof(BlobStorageService<>));

            var configurator = new BlobStorageConfigurator(services);
            configure?.Invoke(configurator);

            return services;
        }
    }
}
