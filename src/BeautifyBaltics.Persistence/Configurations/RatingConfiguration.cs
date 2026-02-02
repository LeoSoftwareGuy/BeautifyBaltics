using BeautifyBaltics.Domain.Aggregates.Rating.Events;
using BeautifyBaltics.Persistence.Configurations.Extensions;
using BeautifyBaltics.Persistence.Projections;

using JasperFx.Events.Projections;

using Marten;
using Marten.Schema;

namespace BeautifyBaltics.Persistence.Configurations;

public class RatingConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<Rating>()
            .DocumentAlias("rating")
            .ForeignKey<Master>(x => x.MasterId)
            .ForeignKey<Client>(x => x.ClientId)
            .ForeignKey<Booking>(x => x.BookingId)
            .UniqueIndex(
                UniqueIndexType.Computed,
                "uq_rating_booking",
                x => x.BookingId
            )
            .MapProjectionMetadata();

        options.Projections.Add<RatingProjection>(ProjectionLifecycle.Inline);

        options.Events.AddEventType(typeof(RatingSubmitted));
        options.Events.AddEventType(typeof(RatingUpdated));
    }
}
