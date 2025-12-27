using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterById;

public record GetMasterByIdRequest
{
    [Required]
    public Guid Id { get; init; }
}
