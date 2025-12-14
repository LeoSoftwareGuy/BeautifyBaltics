using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Configurations.Extensions;
using BeautifyBaltics.Persistence.Projections;

using JasperFx.Events.Projections;

using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class MasterConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<Master>()
            .DocumentAlias("mtr")
            .MapProjectionMetadata();

        options.Projections.Add<MasterProjection>(ProjectionLifecycle.Inline);

        options.Events.AddEventType(typeof(MasterCreated));
        options.Events.AddEventType(typeof(MasterAvailabilityDefined));
    }
}
