using BeautifyBaltics.Domain.Aggregates.Rating.Events;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using JasperFx.Events;
using Marten;
using Marten.Events.Aggregation;

namespace BeautifyBaltics.Persistence.Projections;

public record Rating(Guid Id) : Projection
{
    public Guid BookingId { get; init; }
    public Guid MasterId { get; init; }
    public Guid ClientId { get; init; }
    public required string MasterName { get; init; }
    public required string ClientName { get; init; }
    public int Value { get; init; }
    public string? Comment { get; init; }
    public DateTime SubmittedAt { get; init; }
}

public class RatingProjection : SingleStreamProjection<Rating, Guid>
{
    public static async Task<Rating> Create(IEvent<RatingSubmitted> @event, IQuerySession session, CancellationToken cancellationToken)
    {
        var client = await session.LoadAsync<Client>(@event.Data.ClientId, cancellationToken)
            ?? throw new InvalidOperationException($"Client with ID '{@event.Data.ClientId}' not found.");

        var master = await session.LoadAsync<Master>(@event.Data.MasterId, cancellationToken)
             ?? throw new InvalidOperationException($"Master with ID '{@event.Data.MasterId}' not found.");

        return new Rating(@event.StreamId)
        {
            BookingId = @event.Data.BookingId,
            MasterId = @event.Data.MasterId,
            ClientId = @event.Data.ClientId,
            ClientName = $"{client.FirstName} {client.LastName}",
            MasterName = $"{master.FirstName} {master.LastName}",
            Value = @event.Data.Value,
            Comment = @event.Data.Comment,
            SubmittedAt = @event.Data.SubmittedAt
        };
    }

    public static Rating Apply(RatingUpdated @event, Rating current) =>
        current with
        {
            Value = @event.Value,
            Comment = @event.Comment
        };
}
