namespace BeautifyBaltics.Domain.Aggregates.Rating.Events;

public record RatingUpdated(
    int Value,
    string? Comment,
    DateTime UpdatedAt
);
