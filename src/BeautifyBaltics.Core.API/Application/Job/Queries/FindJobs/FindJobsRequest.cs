using System;
using BeautifyBaltics.Core.API.Application.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Job.Queries.FindJobs;

public record FindJobsRequest : PagedRequest
{
    /// <summary>
    /// Filter by text
    /// </summary>
    public string? Text { get; init; }

    /// <summary>
    /// Filter by category
    /// </summary>
    public Guid? CategoryId { get; init; }
}
