using Marten.Pagination;
using System.ComponentModel.DataAnnotations;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.SeedWork;

public record PagedResponse<T>(T[] Items, long Page, long PageSize, long PageCount, long TotalItemCount)
{
    /// <summary>
    /// Current page number
    /// </summary>
    [Required]
    public long Page { get; init; } = Page;

    /// <summary>
    /// Page size
    /// </summary>
    [Required]
    public long PageSize { get; init; } = PageSize;

    /// <summary>
    /// Total pages count
    /// </summary>
    [Required]
    public long PageCount { get; init; } = PageCount;

    /// <summary>
    /// Total items count
    /// </summary>
    [Required]
    public long TotalItemCount { get; init; } = TotalItemCount;

    /// <summary>
    /// Items
    /// </summary>
    [Required]
    public T[] Items { get; init; } = Items.ToArray();
}

public static class PagedListExtensions
{
    public static PagedResponse<TDto> ToPagedResponse<TEntity, TDto>(this IPagedList<TEntity> pagedList) =>
        new(pagedList.ToList().Adapt<TDto[]>(), pagedList.PageNumber, pagedList.PageSize, pagedList.PageCount, pagedList.TotalItemCount);
}