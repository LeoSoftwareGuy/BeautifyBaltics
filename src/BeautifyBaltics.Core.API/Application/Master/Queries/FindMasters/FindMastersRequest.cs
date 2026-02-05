using System;
using BeautifyBaltics.Core.API.Application.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasters;

public record FindMastersRequest : PagedRequest
{
    public string? Text { get; init; }
    public string? City { get; init; }
    public Guid? JobCategoryId { get; init; }
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
}
