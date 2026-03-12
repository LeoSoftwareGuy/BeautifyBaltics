using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Changeset.Commands.ApproveChangeset;

public record ApproveChangesetRequest
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
    /// Approved by admin identifier
    /// </summary>
    [Required]
    public Guid ApprovedById { get; init; }

    /// <summary>
    /// Comment left by admin
    /// </summary>
    public string? Comment { get; init; }
}
