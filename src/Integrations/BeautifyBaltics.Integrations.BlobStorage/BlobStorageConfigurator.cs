using Microsoft.Extensions.DependencyInjection;

namespace BeautifyBaltics.Integrations.BlobStorage
{
    public class BlobStorageConfigurator(IServiceCollection services) : IBlobStorageConfigurator
    {
        public void Configure<TFile>(Action<BlobStorageOptions<TFile>> configure) where TFile : notnull
        {
            services.Configure(configure);
        }
    }
}
