using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterJobImages;

public record FindMasterJobImagesRequest
{
    [Required]
    [Identity]
    public Guid MasterId { get; init; }
}
