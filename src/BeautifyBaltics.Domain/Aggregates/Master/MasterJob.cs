namespace BeautifyBaltics.Domain.Aggregates.Master;

public partial class MasterAggregate
{
    public class MasterJob(
        Guid masterJobId,
        Guid jobId,
        decimal price,
        TimeSpan duration,
        string title,
        Guid jobCategoryId,
        string jobCategoryName,
        string jobName
    )
    {
        private readonly Dictionary<Guid, MasterJobImage> _images = [];

        public Guid MasterJobId { get; init; } = masterJobId;
        public Guid JobId { get; private set; } = jobId;
        public decimal Price { get; private set; } = price;
        public TimeSpan Duration { get; private set; } = duration;
        public string Title { get; private set; } = title.Trim();
        public Guid JobCategoryId { get; private set; } = jobCategoryId;
        public string JobCategoryName { get; private set; } = jobCategoryName;
        public string JobName { get; private set; } = jobName;
        public IReadOnlyCollection<MasterJobImage> Images => [.. _images.Values];

        public void Update(Guid jobId, decimal price, TimeSpan duration, string title, Guid jobCategoryId, string jobCategoryName, string jobName)
        {
            this.JobId = jobId;
            this.Price = price;
            this.Duration = duration;
            this.Title = title;
            this.JobCategoryId = jobCategoryId;
            this.JobCategoryName = jobCategoryName;
            this.JobName = jobName;
        }

        public void AddImage(MasterJobImage image)
        {
            _images[image.MasterJobImageId] = image;
        }

        public void RemoveImage(Guid masterJobImageId)
        {
            _images.Remove(masterJobImageId);
        }
    }
}
