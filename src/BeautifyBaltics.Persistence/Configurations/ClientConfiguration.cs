using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Persistence.Configurations.Extensions;
using BeautifyBaltics.Persistence.Projections;

using JasperFx.Events.Projections;

using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class ClientConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<Client>()
            .DocumentAlias("cnt")
            .MapProjectionMetadata();

        options.Projections.Add<ClientProjection>(ProjectionLifecycle.Inline);

        options.Events.AddEventType(typeof(ClientRegistered));
        options.Events.AddEventType(typeof(ClientProfileUpdated));
    }
}
