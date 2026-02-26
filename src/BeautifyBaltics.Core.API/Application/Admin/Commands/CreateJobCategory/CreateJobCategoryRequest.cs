using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.CreateJobCategory;

public record CreateJobCategoryRequest
{
    [Required]
    [MaxLength(128)]
    public required string Name { get; init; }
}
