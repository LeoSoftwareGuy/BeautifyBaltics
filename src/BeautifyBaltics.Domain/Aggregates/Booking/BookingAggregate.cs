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
    public Guid MasterAvailabilitySlotId { get; private set; }
    public DateTime ScheduledAt { get; private set; }
    public TimeSpan Duration { get; private set; }
    public decimal Price { get; private set; }
    public BookingStatus Status { get; private set; } = BookingStatus.Requested;

    private static readonly TimeSpan MinimumCancellationNotice = TimeSpan.FromHours(24);

    public BookingAggregate(BookingCreated @event) : this()
    {
        MasterId = @event.MasterId;
        ClientId = @event.ClientId;
        MasterJobId = @event.MasterJobId;
        MasterAvailabilitySlotId = @event.MasterAvailabilitySlotId;
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

    public void Apply(BookingConfirmed @event)
    {
        Status = BookingStatus.Confirmed;
    }

    public void Apply(BookingCancelled @event)
    {
        Status = BookingStatus.Cancelled;
    }

    public void Apply(BookingCompleted @event)
    {
        Status = BookingStatus.Completed;
    }

    public bool Has24HoursPassed()
    {
        var timeUntilBooking = ScheduledAt - DateTime.UtcNow;
        return timeUntilBooking < MinimumCancellationNotice;
    }
}
