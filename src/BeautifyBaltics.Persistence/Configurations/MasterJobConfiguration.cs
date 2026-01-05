using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Projections;
using JasperFx.Events.Projections;
using Marten;
using BeautifyBaltics.Persistence.Configurations.Extensions;

namespace BeautifyBaltics.Persistence.Configurations;

public class MasterJobConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<MasterJob>()
            .DocumentAlias("master_job")
            .ForeignKey<Master>(x => x.MasterId)
            .MapProjectionMetadata();

        options.Projections.Add<MasterJobProjection>(ProjectionLifecycle.Inline);

        options.Events.AddEventType(typeof(MasterJobCreated));
        options.Events.AddEventType(typeof(MasterJobUpdated));
        options.Events.AddEventType(typeof(MasterJobDeleted));
        options.Events.AddEventType(typeof(MasterJobImageUploaded));
    }
}
