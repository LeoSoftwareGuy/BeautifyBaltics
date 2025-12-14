using System.Text.Json.Serialization;

namespace BeautifyBaltics.Persistence.Projections.SeedWork
{
    public abstract record Projection : IProjection
    {
        public Guid CreatedById { get; set; }
        public Guid? ModifiedById { get; set; }

        [JsonIgnore] public DateTimeOffset CreatedAt { get; set; }
        [JsonIgnore] public DateTimeOffset ModifiedAt { get; set; }
        [JsonIgnore] public string LastModifiedBy { get; set; } = null!;
        [JsonIgnore] public string CorrelationId { get; set; } = null!;
        [JsonIgnore] public string CausationId { get; set; } = null!;
    }
}
