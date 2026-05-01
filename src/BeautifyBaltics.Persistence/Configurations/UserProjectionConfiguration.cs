using BeautifyBaltics.Persistence.Configurations.Extensions;
using BeautifyBaltics.Persistence.Projections;
using JasperFx.Events.Projections;
using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class UserProjectionConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<UserProjection>()
            .DocumentAlias("user_projection")
            .Duplicate(x => x.Email)
            .Duplicate(x => x.Role)
            .Duplicate(x => x.PhoneNumber)
            .MapProjectionMetadata();

        options.Projections.Add<UserProjectionProjection>(ProjectionLifecycle.Async);
    }
}
