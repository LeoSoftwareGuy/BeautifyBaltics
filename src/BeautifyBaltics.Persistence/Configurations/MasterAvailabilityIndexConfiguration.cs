using BeautifyBaltics.Persistence.Configurations.Extensions;
using BeautifyBaltics.Persistence.Projections;
using JasperFx.Events.Projections;
using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class MasterAvailabilityIndexConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<MasterAvailabilityIndex>()
            .DocumentAlias("master_av_index")
            .ForeignKey<Master>(x => x.MasterId)
            .Index(x => new { x.MasterId, x.SlotType, x.StartAt, x.EndAt })
            .MapProjectionMetadata();

        options.Projections.Add<MasterAvailabilityIndexProjection>(ProjectionLifecycle.Inline);
    }
}
