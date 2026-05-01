using BeautifyBaltics.Persistence.Configurations.Extensions;
using BeautifyBaltics.Persistence.Projections;
using JasperFx.Events.Projections;
using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class AdminUserStatisticsConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<AdminUserStatistics>()
            .DocumentAlias("admin_user_stats")
            .Duplicate(x => x.Role)
            .Duplicate(x => x.EmailVerified)
            .MapProjectionMetadata();

        options.Projections.Add<AdminUserStatisticsProjection>(ProjectionLifecycle.Async);
    }
}
