using BeautifyBaltics.Domain.Aggregates.Master.Events;
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

            options.Events.AddEventType(typeof(MasterAvailabilitySlotCreated));
            options.Events.AddEventType(typeof(MasterAvailabilitySlotUpdated));
            options.Events.AddEventType(typeof(MasterAvailabilitySlotDeleted));
        }
    }
}
