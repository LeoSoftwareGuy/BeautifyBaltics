using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Documents;
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
    public required string MasterJobCategoryName { get; init; }
    public string? MasterJobCategoryImageUrl { get; init; }
    public string? LocationCity { get; init; }
    public string? LocationCountry { get; init; }
    public string? LocationAddressLine1 { get; init; }
    public string? LocationAddressLine2 { get; init; }
    public string? LocationPostalCode { get; init; }
    public DateTime ScheduledAt { get; init; }
    public TimeSpan Duration { get; init; }
    public decimal Price { get; init; }
    public BookingStatus Status { get; init; } = BookingStatus.Requested;
    public DateTime RequestedAt { get; init; }

    public string? LocationName =>
        !string.IsNullOrWhiteSpace(LocationCity) ? LocationCity :
        !string.IsNullOrWhiteSpace(LocationCountry) ? LocationCountry : null;

    public string? LocationAddress
    {
        get
        {
            var segments = new[] { LocationAddressLine1, LocationAddressLine2, LocationPostalCode, LocationCountry }
                .Where(s => !string.IsNullOrWhiteSpace(s));
            var address = string.Join(", ", segments);
            return string.IsNullOrWhiteSpace(address) ? null : address;
        }
    }
}

public class BookingProjection : SingleStreamProjection<Booking, Guid>
{
    public static async Task<Booking> Create(IEvent<BookingCreated> @event, IQuerySession session, CancellationToken cancellationToken)
    {
        var master = await session.LoadAsync<Master>(@event.Data.MasterId, cancellationToken)
            ?? throw new InvalidOperationException($"Booking with master ID '{@event.Data.MasterId}' not found.");

        var client = await session.LoadAsync<Client>(@event.Data.ClientId, cancellationToken)
            ?? throw new InvalidOperationException($"Booking with client ID '{@event.Data.ClientId}' not found.");

        var masterJob = await session.LoadAsync<MasterJob>(@event.Data.MasterJobId, cancellationToken)
            ?? throw new InvalidOperationException($"Booking with master job ID {@event.Data.MasterJobId} not found.");

        var jobCategory = await session.LoadAsync<JobCategory>(masterJob.JobCategoryId, cancellationToken);

        var requestedAt = DateTime.SpecifyKind(@event.Timestamp.UtcDateTime, DateTimeKind.Unspecified);

        return new Booking(@event.StreamId)
        {
            MasterId = @event.Data.MasterId,
            MasterName = $"{master.FirstName} {master.LastName}",
            ClientId = @event.Data.ClientId,
            ClientName = $"{client.FirstName} {client.LastName}",
            MasterJobId = @event.Data.MasterJobId,
            MasterJobTitle = masterJob.Title,
            MasterJobCategoryName = masterJob.JobCategoryName,
            MasterJobCategoryImageUrl = jobCategory?.ImageUrl,
            LocationCity = master.City,
            LocationCountry = master.Country,
            LocationAddressLine1 = master.AddressLine1,
            LocationAddressLine2 = master.AddressLine2,
            LocationPostalCode = master.PostalCode,
            ScheduledAt = @event.Data.ScheduledAt,
            Duration = @event.Data.Duration,
            Price = @event.Data.Price,
            Status = BookingStatus.Requested,
            RequestedAt = requestedAt
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

    public static Booking Apply(BookingConfirmed @event, Booking current) =>
        current with { Status = BookingStatus.Confirmed };

    public static Booking Apply(BookingCancelled @event, Booking current) =>
        current with { Status = BookingStatus.Cancelled };

    public static Booking Apply(BookingCompleted @event, Booking current) =>
        current with { Status = BookingStatus.Completed };
}
