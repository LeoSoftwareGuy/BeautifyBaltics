using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.UpdateJobCategory;

public record UpdateJobCategoryRequest
{
    /// <summary>
    /// Job category identifier
    /// </summary>
    [Required]
    public Guid Id { get; init; }

    /// <summary>
    /// Job category name
    /// </summary>
    [Required]
    public required string Name { get; init; }
}
