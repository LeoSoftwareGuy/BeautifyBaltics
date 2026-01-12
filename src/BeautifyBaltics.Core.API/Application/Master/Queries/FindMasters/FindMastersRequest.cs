using System;
using BeautifyBaltics.Core.API.Application.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasters;

public record FindMastersRequest : PagedRequest
{
    public string? Text { get; init; }
    public string? City { get; init; }
    public Guid? JobCategoryId { get; init; }
}
