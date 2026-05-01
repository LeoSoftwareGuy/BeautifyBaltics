using System.Text.Json;
using JasperFx.Core;

namespace BeautifyBaltics.Domain.SeedWork.Approvable.Events;

public abstract record ChangeProposed
{
    /// <summary>
    /// Change identifier
    /// </summary>
    public Guid ChangesetId { get; init; } = CombGuidIdGeneration.NewGuid();

    /// <summary>
    /// Aggregate identifier
    /// </summary>
    public Guid AggregateId { get; init; }

    /// <summary>
    /// Optional sub-entity ID (e.g. MasterJobId for job/image changes).
    /// </summary>
    public Guid? EntityId { get; init; }

    /// <summary>
    /// Proposed by user Id
    /// </summary>
    public Guid ProposedById { get; init; }

    /// <summary>
    /// Serialized snapshot of the proposed change data object.
    /// </summary>
    public JsonElement ProposedChange { get; init; }

    /// <summary>
    /// Full type name of the proposed change data object, used for deserialization
    /// </summary>
    public string Type { get; init; } = string.Empty;
   
}
