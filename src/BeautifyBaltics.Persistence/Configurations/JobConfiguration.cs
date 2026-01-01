using BeautifyBaltics.Domain.Documents;
using Marten;
using Marten.Schema.Indexing.Unique;

namespace BeautifyBaltics.Persistence.Configurations
{
    public class JobConfiguration : IConfigureMarten
    {
        public void Configure(IServiceProvider services, StoreOptions options)
        {
            options.Schema.For<Job>()
                .UniqueIndex(Marten.Schema.UniqueIndexType.Computed, "uq_job_name", x => x.Name)
                .DocumentAlias("job");
        }
    }
}
