using Marten.Metadata;

namespace BeautifyBaltics.Domain.SeedWork;

public interface IAudited : ITracked
{
    Guid CreatedById { get; set; }
    DateTimeOffset CreatedAt { get; set; }
    Guid? ModifiedById { get; set; }
    DateTimeOffset ModifiedAt { get; set; }
}
