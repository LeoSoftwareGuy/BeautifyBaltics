namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterBufferTimeUpdated(Guid MasterId, int BufferMinutes);
