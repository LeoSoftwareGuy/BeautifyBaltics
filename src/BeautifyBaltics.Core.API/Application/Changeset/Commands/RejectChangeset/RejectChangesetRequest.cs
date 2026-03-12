using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Changeset.Commands.RejectChangeset;

public record RejectChangesetRequest
{
    /// <summary>
    /// Master identifier
    /// </summary>
    [Required]
    [Identity]
    public Guid MasterId { get; init; }

    /// <summary>
    /// Changeset identifier
    /// </summary>
    [Required]
    public Guid ChangesetId { get; init; }

    /// <summary>
    /// Rejected by admin identifer
    /// </summary>
    [Required]
    public Guid RejectedById { get; init; }

    /// <summary>
    /// Comment left by admin
    /// </summary>
    public string? Comment { get; init; }
}
