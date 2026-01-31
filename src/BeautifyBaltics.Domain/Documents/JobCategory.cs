using System.Text.Json.Serialization;
using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.Documents;

public class JobCategory : Document<Guid>
{
    public JobCategory()
    {
    }

    public JobCategory(Guid id, string name, string? imageUrl = null) : base(id)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentNullException(nameof(name));
        Name = name.Trim();
        ImageUrl = imageUrl;
    }

    [JsonInclude]
    public string Name { get; private set; } = string.Empty;

    [JsonInclude]
    public string? ImageUrl { get; private set; }

    public void Rename(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentNullException(nameof(name));
        Name = name.Trim();
    }

    public void SetImageUrl(string? imageUrl)
    {
        ImageUrl = string.IsNullOrWhiteSpace(imageUrl) ? null : imageUrl;
    }
}
