using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Persistence.Configurations.Extensions;
using BeautifyBaltics.Persistence.Projections;

using JasperFx.Events.Projections;

using Marten;
using Marten.Schema;

namespace BeautifyBaltics.Persistence.Configurations;

public class BookingConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<Booking>()
            .DocumentAlias("booking")
            .ForeignKey<Master>(x => x.MasterId)
            .ForeignKey<Client>(x => x.ClientId)
            .UniqueIndex(
                UniqueIndexType.Computed,
                "uq_bok_sch_at_master",
                x => x.MasterId,
                x => x.ScheduledAt,
                x => x.Status
            )
            .UniqueIndex(
                UniqueIndexType.Computed,
                "uq_bok_sch_at_client",
                x => x.ClientId,
                x => x.ScheduledAt,
                x => x.Status
            )
            .MapProjectionMetadata();

        options.Projections.Add<BookingProjection>(ProjectionLifecycle.Inline);

        options.Events.AddEventType(typeof(BookingCreated));
        options.Events.AddEventType(typeof(BookingRescheduled));
        options.Events.AddEventType(typeof(BookingConfirmed));
        options.Events.AddEventType(typeof(BookingCancelled));
    }
}
