using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Projections.Changesets;
using JasperFx.Events.Projections;
using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class ChangesetConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<Changeset>()
            .DocumentAlias("changeset")
            .Index(x => x.MasterId)
            .Index(x => x.Status);

        options.Projections.Add<ChangesetProjection>(ProjectionLifecycle.Inline);

        options.Events.AddEventType(typeof(MasterChangeProposed));
        options.Events.AddEventType(typeof(MasterChangesetApproved));
        options.Events.AddEventType(typeof(MasterChangesetRejected));
        options.Events.AddEventType(typeof(MasterActivated));
    }
}
