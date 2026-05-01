using System.Text.Json;

namespace BeautifyBaltics.Persistence.Projections.Changesets;

public record Changeset(Guid Id)
{
    /// <summary>
    /// Master identifier
    /// </summary>
    public Guid MasterId { get; init; }

    /// <summary>
    /// Sub-entity ID — populated for job and image changes (MasterJobId).
    /// </summary>
    public Guid? EntityId { get; init; }

    /// <summary>
    /// Full type name of the proposed change data object.
    /// </summary>
    public string Type { get; init; } = string.Empty;

    /// <summary>
    /// Actual change to be applied
    /// </summary>
    public JsonElement ProposedChange { get; init; }

    /// <summary>
    /// User identfier who wants to change something
    /// </summary>
    public Guid ProposedById { get; init; }

    /// <summary>
    /// When did user change something
    /// </summary>
    public DateTimeOffset ProposedAt { get; init; }

    /// <summary>
    /// Status of the changeset
    /// </summary>
    public ChangesetStatus Status { get; init; } = ChangesetStatus.Pending;

    /// <summary>
    /// Approved by admin identfier
    /// </summary>
    public Guid? ApprovedById { get; init; }

    /// <summary>
    /// When changeset was approved
    /// </summary>
    public DateTimeOffset? ApprovedAt { get; init; }

    /// <summary>
    /// Rejected by admin identifier
    /// </summary>
    public Guid? RejectedById { get; init; }

    /// <summary>
    /// When changeset was rejected
    /// </summary>
    public DateTimeOffset? RejectedAt { get; init; }

    /// <summary>
    /// Comment left
    /// </summary>
    public string? Comment { get; init; }
}
