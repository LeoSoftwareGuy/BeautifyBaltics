using System.Text.Json.Serialization;

namespace BeautifyBaltics.Domain.SeedWork;

/// <summary>
/// Base type for document-style entities persisted outside event sourcing.
/// </summary>
/// <typeparam name="TId">Document identifier type.</typeparam>
public abstract class Document<TId> : IDocument
    where TId : notnull
{
    protected Document() { }

    protected Document(TId id)
    {
        Id = id;
    }

    public TId Id { get; init; } = default!;
    public Guid CreatedById { get; set; }
    public Guid? ModifiedById { get; set; }

    [JsonIgnore] public DateTimeOffset CreatedAt { get; set; }
    [JsonIgnore] public DateTimeOffset ModifiedAt { get; set; }
    [JsonIgnore] public bool Deleted { get; set; }
    [JsonIgnore] public DateTimeOffset? DeletedAt { get; set; }
    [JsonIgnore] public string LastModifiedBy { get; set; } = null!;
    [JsonIgnore] public string CorrelationId { get; set; } = null!;
    [JsonIgnore] public string CausationId { get; set; } = null!;
}
