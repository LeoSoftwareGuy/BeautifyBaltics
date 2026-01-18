using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using JasperFx.Events;
using Marten;
using Marten.Events.Aggregation;

namespace BeautifyBaltics.Persistence.Projections;

public record Booking(Guid Id) : Projection
{
    public Guid MasterId { get; init; }
    public required string MasterName { get; init; }
    public Guid ClientId { get; init; }
    public required string ClientName { get; init; }
    public Guid MasterJobId { get; init; }
    public required string MasterJobTitle { get; init; }
    public Guid MasterAvailabilitySlotId { get; init; }
    public DateTime ScheduledAt { get; init; }
    public TimeSpan Duration { get; init; }
    public decimal Price { get; init; }
    public BookingStatus Status { get; init; } = BookingStatus.Requested;
}

public class BookingProjection : SingleStreamProjection<Booking, Guid>
{
    public static async Task<Booking> Create(IEvent<BookingCreated> @event, IQuerySession session, CancellationToken cancellationToken)
    {
        var master = await session.LoadAsync<Master>(@event.Data.MasterId, cancellationToken)
            ?? throw new InvalidOperationException($"Booking with master ID '{@event.Data.MasterId}' not found.");

        var client = await session.LoadAsync<Client>(@event.Data.ClientId, cancellationToken)
            ?? throw new InvalidOperationException($"Booking with client ID '{@event.Data.ClientId}' not found.");

        var masterJob = await session.LoadAsync<MasterJob>(@event.Data.MasterJobId, cancellationToken);

        var masterAvailability = await session.LoadAsync<MasterAvailabilitySlot>(@event.Data.MasterAvailabilitySlotId, cancellationToken)
            ?? throw new InvalidOperationException($"Master availability with ID '{@event.Data.MasterAvailabilitySlotId}' not found.");

        return masterJob == null
            ? throw new InvalidOperationException($"Booking with master job ID {@event.Data.MasterJobId} not found.")
            : new Booking(@event.StreamId)
        {
            MasterId = @event.Data.MasterId,
            MasterName = $"{master.FirstName} {master.LastName}",
            ClientId = @event.Data.ClientId,
            ClientName = $"{client.FirstName} {client.LastName}",
            MasterJobId = @event.Data.MasterJobId,
            MasterJobTitle = masterJob.Title,
            MasterAvailabilitySlotId = @event.Data.MasterAvailabilitySlotId,
            ScheduledAt = @event.Data.ScheduledAt,
            Duration = @event.Data.Duration,
            Price = @event.Data.Price,
            Status = BookingStatus.Requested,
        };
    }

    public static Booking Apply(BookingUpdated @event, Booking current)
    {
        return current with
        {
            MasterId = @event.MasterId,
            ClientId = @event.ClientId,
            MasterJobId = @event.MasterJobId,
            ScheduledAt = @event.ScheduledAt,
            Duration = @event.Duration,
            Price = @event.Price
        };
    }

    public static Booking Apply(BookingRescheduled @event, Booking current)
    {
        return current with
        {
            ScheduledAt = @event.ScheduledAt,
            Duration = @event.Duration,
        };
    }

    public static Booking Apply(BookingStatusChanged @event, Booking current)
    {
        return current with { Status = @event.Status };
    }
}
