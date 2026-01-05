using BeautifyBaltics.Core.API.Application.SeedWork;
using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.Shared;

public record MasterPortfolioFileDTO : FileMetadataDTO
{
    [Required]
    public Guid MasterPortfolioImageId { get; init; }
}
