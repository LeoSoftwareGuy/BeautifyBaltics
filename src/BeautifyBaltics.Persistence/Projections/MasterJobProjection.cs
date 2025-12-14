using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using JasperFx.Events;
using Marten.Events.Aggregation;

namespace BeautifyBaltics.Persistence.Projections;

public record MasterJob(Guid Id, Guid MasterId) : Projection
{
    public Guid JobId { get; init; }
    public string Title { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public TimeSpan Duration { get; init; }
}

public class MasterJobProjection : SingleStreamProjection<MasterJob, Guid>
{
    public MasterJobProjection()
    {
        DeleteEvent<MasterJobDeleted>();
    }

    public static MasterJob Create(IEvent<MasterJobCreated> @event)
    {
        return new MasterJob(@event.StreamId, @event.Data.MasterId)
        {
            JobId = @event.Data.JobId,
            Title = @event.Data.Title,
            Price = @event.Data.Price,
            Duration = @event.Data.Duration
        };
    }

    public static MasterJob Apply(MasterJobUpdated @event, MasterJob current) =>
        current with { MasterId = @event.MasterId, JobId = @event.JobId, Title = @event.Title, Price = @event.Price, Duration = @event.Duration };
}