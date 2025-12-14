namespace BeautifyBaltics.Domain.Aggregates.Master;

public partial class MasterAggregate
{
    public class MasterJob(
        Guid masterJobId,
        Guid jobId,
        decimal price,
        TimeSpan duration,
        string title
    )
    {
        public Guid MasterJobId { get; init; } = masterJobId;
        public Guid JobId { get; private set; } = jobId;
        public decimal Price { get; private set; } = price;
        public TimeSpan Duration { get; private set; } = duration;
        public string Title { get; private set; } = title.Trim();

        public void Update(Guid jobId, decimal price, TimeSpan duration, string title)
        {
            this.JobId = jobId;
            this.Price = price;
            this.Duration = duration;
            this.Title = title;
        }
    }
}
