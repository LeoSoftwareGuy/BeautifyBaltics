using BeautifyBaltics.Domain.Aggregates.Rating.Events;
using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.Aggregates.Rating;

public class RatingAggregate : Aggregate
{
    public RatingAggregate() { }

    public Guid BookingId { get; private set; }
    public Guid MasterId { get; private set; }
    public Guid ClientId { get; private set; }
    public int Value { get; private set; }
    public string? Comment { get; private set; }
    public DateTime SubmittedAt { get; private set; }

    public RatingAggregate(RatingSubmitted @event) : this()
    {
        BookingId = @event.BookingId;
        MasterId = @event.MasterId;
        ClientId = @event.ClientId;
        Value = @event.Value;
        Comment = @event.Comment;
        SubmittedAt = @event.SubmittedAt;
    }

    public void Apply(RatingUpdated @event)
    {
        Value = @event.Value;
        Comment = @event.Comment;
    }
}
