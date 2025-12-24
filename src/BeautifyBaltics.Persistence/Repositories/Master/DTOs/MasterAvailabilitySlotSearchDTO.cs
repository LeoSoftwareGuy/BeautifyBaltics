using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Master.DTOs
{
    public record MasterAvailabilitySlotSearchDTO : BaseSearchDTO
    {
        public DateTime? StartAt { get; init; }
        public DateTime? EndAt { get; init; }
    }
}
