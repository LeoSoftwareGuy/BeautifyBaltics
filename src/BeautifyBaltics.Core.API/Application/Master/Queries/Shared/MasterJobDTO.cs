using System;
using System.Collections.Generic;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.Shared;

public record MasterJobDTO
{
    public Guid Id { get; init; }
    public Guid JobId { get; init; }
    public Guid JobCategoryId { get; init; }
    public string JobCategoryName { get; init; } = string.Empty;
    public string JobName { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int DurationMinutes { get; init; }
    public IReadOnlyCollection<MasterJobImageDTO> Images { get; init; } = Array.Empty<MasterJobImageDTO>();
}
