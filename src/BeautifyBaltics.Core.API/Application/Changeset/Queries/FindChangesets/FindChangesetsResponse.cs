using System.Text.Json;
using BeautifyBaltics.Persistence.Projections.Changesets;

namespace BeautifyBaltics.Core.API.Application.Changeset.Queries.FindChangesets;

public record FindChangesetsResponse(
    Guid Id,
    Guid MasterId,
    Guid? EntityId,
    string Type,
    JsonElement ProposedChange,
    Guid ProposedById,
    DateTimeOffset ProposedAt,
    ChangesetStatus Status,
    Guid? ApprovedById,
    DateTimeOffset? ApprovedAt,
    Guid? RejectedById,
    DateTimeOffset? RejectedAt,
    string? Comment
);
