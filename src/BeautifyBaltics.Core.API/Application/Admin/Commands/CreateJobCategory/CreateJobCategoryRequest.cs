using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.CreateJobCategory;

public record CreateJobCategoryRequest
{
    /// <summary>
    /// Name of the category
    /// </summary>
    [Required]
    public required string Name { get; init; }
}
