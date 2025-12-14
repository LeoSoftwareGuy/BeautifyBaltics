namespace BeautifyBaltics.Persistence.Repositories.SeedWork;

/// <summary>
/// A concrete implementation of <see cref="BaseSearchDTO"/> that encapsulate
/// paging and sorting parameters for queries.
/// </summary>
public record ConcreteSearchDTO : BaseSearchDTO;

/// <summary>
/// Base record for search parameters including paging and sorting.
/// </summary>
public abstract record BaseSearchDTO
{
    private int _defaultPageSize = 10;

    /// <summary>
    /// Indicates which page to get.
    /// </summary>
    public int Page { get; init; } = 1;

    /// <summary>
    /// Indicates the number of items per page.
    /// </summary>
    public int PageSize
    {
        get => All is true ? int.MaxValue : _defaultPageSize;
        init => _defaultPageSize = value;
    }

    /// <summary>
    /// Indicates if all items should be returned
    /// </summary>
    public bool? All { get; init; }

    /// <summary>
    /// Indicates name of the column to sort by
    /// </summary>
    public string? SortBy { get; init; }

    /// <summary>
    /// Indicates if sorting should be done in ascending or descending order
    /// </summary>
    public bool Ascending { get; init; }
}