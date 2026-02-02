namespace BeautifyBaltics.Domain.Aggregates.Rating.Events;

public record RatingSubmitted(
    Guid BookingId,
    Guid MasterId,
    Guid ClientId,
    int Value,
    string? Comment,
    DateTime SubmittedAt
);
