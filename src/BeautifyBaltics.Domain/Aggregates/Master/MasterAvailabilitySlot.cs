namespace BeautifyBaltics.Domain.Aggregates.Master
{
    public partial class MasterAggregate
    {
        public class MasterAvailabilitySlot(
            Guid id,
            Guid masterId,
            DateTime startAt,
            DateTime endAt,
            bool isBooked = false
        )
        {
            public Guid Id { get; private set; } = id;

            public Guid MasterId { get; private set; } = masterId;

            public DateTime StartAt { get; private set; } = startAt;

            public DateTime EndAt { get; private set; } = endAt;

            public bool IsBooked { get; private set; } = isBooked;

            public void Update(Guid masterId, DateTime startAt, DateTime endAt)
            {
                MasterId = masterId;
                StartAt = startAt;
                EndAt = endAt;
            }

            public void MarkAsBooked()
            {
                IsBooked = true;
            }

            public void Restore()
            {
                IsBooked = false;
            }
        }
    }
}
