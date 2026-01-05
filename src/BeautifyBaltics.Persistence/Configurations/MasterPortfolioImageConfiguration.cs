using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Configurations.Extensions;
using BeautifyBaltics.Persistence.Projections;
using JasperFx.Events.Projections;
using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class MasterPortfolioImageConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<MasterPortfolioImage>()
            .DocumentAlias("master_portfolio_image")
            .ForeignKey<Master>(x => x.MasterId)
            .MapProjectionMetadata();

        options.Projections.Add<MasterPortfolioImageProjection>(ProjectionLifecycle.Inline);

        options.Events.AddEventType(typeof(MasterPortfolioImageUploaded));
    }
}
