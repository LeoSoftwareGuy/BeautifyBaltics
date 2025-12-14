using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.Documents;

public class Job : Document<Guid>
{
    public Job() { }

    public Job(Guid id, string name, TimeSpan duration, string description, IReadOnlyCollection<string> images)
        : base(id)
    {
        Name = name;
        Duration = duration;
        Description = description;
        Images = images.ToArray();
    }

    public string Name { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public string Description { get; set; } = string.Empty;
    public IReadOnlyCollection<string> Images { get; set; } = Array.Empty<string>();
}
