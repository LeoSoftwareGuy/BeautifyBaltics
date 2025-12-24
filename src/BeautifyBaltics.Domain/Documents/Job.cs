using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.Documents;

public class Job : Document<Guid>
{
    public Job() { }

    public string Name { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public TimeSpan Duration { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public IReadOnlyCollection<string> Images { get; private set; } = [];

    public Job(Guid id, string name, string category, TimeSpan duration, string description, IReadOnlyCollection<string> images)
        : base(id)
    {
        Name = name.Trim();
        Category = category.Trim();
        Duration = duration;
        Description = description.Trim();
        Images = [.. images];
    }

    public void Update(string name, string category, TimeSpan duration, string description, IReadOnlyCollection<string> images)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentNullException(nameof(name));
        Name = name.Trim();

        if (string.IsNullOrWhiteSpace(category)) throw new ArgumentNullException(nameof(category));
        Category = category.Trim();

        Duration = duration;

        if (string.IsNullOrWhiteSpace(description)) throw new ArgumentNullException(nameof(description));
        Description = description;

        Images = images;
    }
}
