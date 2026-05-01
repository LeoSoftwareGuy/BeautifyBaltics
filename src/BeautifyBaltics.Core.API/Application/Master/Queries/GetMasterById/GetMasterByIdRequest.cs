using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterById;

public record GetMasterByIdRequest
{
    [Required]
    public Guid Id { get; init; }
    /// <summary>Authenticated caller's user ID — set by controller, not from request body</summary>
    public Guid? RequesterId { get; init; }
}
