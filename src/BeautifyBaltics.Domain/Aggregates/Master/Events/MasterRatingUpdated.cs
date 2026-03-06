namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterRatingUpdated(Guid MasterId, decimal AverageRating);
