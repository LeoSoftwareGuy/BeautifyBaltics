using Marten.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterProfileImage;

public record GetMasterProfileImageRequest
{
    [Required]
    [Identity]
    public Guid MasterId { get; init; }
}
