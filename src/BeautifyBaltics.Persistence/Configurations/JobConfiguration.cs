using BeautifyBaltics.Domain.Documents;
using Marten;

namespace BeautifyBaltics.Persistence.Configurations
{
    public class JobConfiguration : IConfigureMarten
    {
        public void Configure(IServiceProvider services, StoreOptions options)
        {
            options.Schema.For<Job>()
                .SingleTenanted()
                .DocumentAlias("job");
        }
    }
}

