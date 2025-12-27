namespace BeautifyBaltics.Core.API.Application.Master.Queries.Shared;

public record MasterAvailabilitySlotDTO
{
    public Guid Id { get; init; }
    public DateTime StartAt { get; init; }
    public DateTime EndAt { get; init; }
}
