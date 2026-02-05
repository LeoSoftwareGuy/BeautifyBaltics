namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetAvailableTimeSlots;

public record GetAvailableTimeSlotsResponse
{
    public required List<AvailableTimeSlotDTO> Slots { get; init; }
}

public record AvailableTimeSlotDTO
{
    public DateTime StartAt { get; init; }
    public DateTime EndAt { get; init; }
}
