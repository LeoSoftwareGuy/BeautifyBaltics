using System.Text.Json.Serialization;
using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.Documents;

public class Job : Document<Guid>
{
    public Job() { }

    [JsonInclude]
    public string Name { get; private set; } = string.Empty;
    [JsonInclude]
    public Guid CategoryId { get; private set; }
    [JsonInclude]
    public string CategoryName { get; private set; } = string.Empty;
    [JsonInclude]
    public TimeSpan Duration { get; private set; }
    [JsonInclude]
    public string Description { get; private set; } = string.Empty;

    public Job(Guid id, string name, Guid categoryId, string categoryName, TimeSpan duration, string description)
        : base(id)
    {
        Name = name.Trim();
        CategoryId = categoryId;
        CategoryName = categoryName.Trim();
        Duration = duration;
        Description = description.Trim();
    }

    public void Update(string name, Guid categoryId, string categoryName, TimeSpan duration, string description)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentNullException(nameof(name));
        Name = name.Trim();

        if (string.IsNullOrWhiteSpace(categoryName)) throw new ArgumentNullException(nameof(categoryName));
        CategoryId = categoryId;
        CategoryName = categoryName.Trim();

        Duration = duration;

        if (string.IsNullOrWhiteSpace(description)) throw new ArgumentNullException(nameof(description));
        Description = description;
    }
}
