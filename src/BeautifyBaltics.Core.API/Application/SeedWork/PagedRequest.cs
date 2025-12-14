namespace BeautifyBaltics.Core.API.Application.SeedWork;

public record PagedRequest
{
    /// <summary>
    /// Page number
    /// </summary>
    public int Page { get; set; } = 1;

    /// <summary>
    /// Items per page
    /// </summary>
    public int PageSize { get; set; } = 10;

    /// <summary>
    /// Sort by column
    /// </summary>
    public string? SortBy { get; init; }

    /// <summary>
    /// Is sorting order ascending or descending, defaults to false (descending)
    /// </summary>
    public bool Ascending { get; init; } = false;

    /// <summary>
    /// Retrieve all items
    /// </summary>
    public bool? All { get; init; }
}

