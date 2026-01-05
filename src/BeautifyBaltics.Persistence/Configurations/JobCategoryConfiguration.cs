using BeautifyBaltics.Domain.Documents;
using Marten;

namespace BeautifyBaltics.Persistence.Configurations
{
    public class JobCategoryConfiguration : IConfigureMarten
    {
        public void Configure(IServiceProvider services, StoreOptions options)
        {
            options.Schema.For<JobCategory>()
                .UniqueIndex(x => x.Name)
                .FullTextIndex(x => x.Name)
                .DocumentAlias("job_category");
        }
    }
}
