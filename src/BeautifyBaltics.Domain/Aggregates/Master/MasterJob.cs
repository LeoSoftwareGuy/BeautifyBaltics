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
        private readonly Dictionary<Guid, MasterJobImage> _images = [];

        public Guid MasterJobId { get; init; } = masterJobId;
        public Guid JobId { get; private set; } = jobId;
        public decimal Price { get; private set; } = price;
        public TimeSpan Duration { get; private set; } = duration;
        public string Title { get; private set; } = title.Trim();
        public IReadOnlyCollection<MasterJobImage> Images => [.. _images.Values];

        public void Update(Guid jobId, decimal price, TimeSpan duration, string title)
        {
            this.JobId = jobId;
            this.Price = price;
            this.Duration = duration;
            this.Title = title;
        }

        public void AddImage(MasterJobImage image)
        {
            _images[image.MasterJobImageId] = image;
        }
    }
}
