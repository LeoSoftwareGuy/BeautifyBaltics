using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterJobImage;

public record GetMasterJobImageByIdRequest
{
    [Required]
    public Guid MasterId { get; init; }

    [Required]
    public Guid MasterJobId { get; init; }

    [Required]
    public Guid MasterJobImageId { get; init; }
}
