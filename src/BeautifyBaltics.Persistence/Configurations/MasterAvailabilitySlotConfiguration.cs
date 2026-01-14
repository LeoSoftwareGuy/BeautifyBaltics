using BeautifyBaltics.Persistence.Configurations.Extensions;
using BeautifyBaltics.Persistence.Projections;
using JasperFx.Events.Projections;
using Marten;

namespace BeautifyBaltics.Persistence.Configurations
{
    public class MasterAvailabilitySlotConfiguration : IConfigureMarten
    {
        public void Configure(IServiceProvider services, StoreOptions options)
        {
            options.Schema.For<MasterAvailabilitySlot>()
                .DocumentAlias("master_av_slot")
                .ForeignKey<Master>(x => x.MasterId)
                .MapProjectionMetadata();

            options.Projections.Add<MasterAvailabilitySlotProjection>(ProjectionLifecycle.Inline);
        }
    }
}
