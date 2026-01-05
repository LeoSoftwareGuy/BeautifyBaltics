using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.Documents;

public class JobCategory : Document<Guid>
{
    public JobCategory()
    {
    }

    public JobCategory(Guid id, string name) : base(id)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentNullException(nameof(name));
        Name = name.Trim();
    }

    public string Name { get; private set; } = string.Empty;

    public void Rename(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentNullException(nameof(name));
        Name = name.Trim();
    }
}
