using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.Aggregates.Booking;

public class BookingAggregate : Aggregate
{
    public BookingAggregate() { }

    public Guid MasterId { get; private set; }
    public Guid ClientId { get; private set; }
    public Guid MasterJobId { get; private set; }
    public DateTime ScheduledAt { get; private set; }
    public TimeSpan Duration { get; private set; }
    public decimal Price { get; private set; }
    public BookingStatus Status { get; private set; } = BookingStatus.Requested;

    public BookingAggregate(BookingCreated @event) : this()
    {
    }

    public void Apply(BookingUpdated @event)
    {
        Id = @event.BookingId;
        MasterId = @event.MasterId;
        ClientId = @event.ClientId;
        MasterJobId = @event.MasterJobId;
        ScheduledAt = @event.ScheduledAt;
        Duration = @event.Duration;
        Price = @event.Price;
        Status = BookingStatus.Requested;
    }

    public void Apply(BookingRescheduled @event)
    {
        ScheduledAt = @event.ScheduledAt;
        Duration = @event.Duration;
    }

    public void Apply(BookingStatusChanged @event)
    {
        Status = @event.Status;
    }
}
