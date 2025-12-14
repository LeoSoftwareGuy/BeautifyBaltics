using BeautifyBaltics.Core.API.Contracts.Jobs;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Job;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

using Marten;

using Microsoft.AspNetCore.Mvc;

namespace BeautifyBaltics.Core.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController(
    IJobRepository jobRepository,
    ICommandRepository commandRepository,
    IDocumentSession documentSession
) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobResponse>>> Search([FromQuery] JobSearchDTO criteria, CancellationToken cancellationToken)
    {
        var jobs = await jobRepository.SearchAsync(criteria, cancellationToken);
        return Ok(jobs.Select(ToResponse));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<JobResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var job = await jobRepository.GetByIdAsync(id, cancellationToken);
        if (job is null) return NotFound();
        return Ok(ToResponse(job));
    }

    [HttpPost]
    public async Task<ActionResult<JobResponse>> Create([FromBody] CreateJobRequest request, CancellationToken cancellationToken)
    {
        var job = new JobProjection
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Duration = TimeSpan.FromMinutes(request.DurationMinutes),
            Images = request.Images
        };

        commandRepository.Insert(job);
        await documentSession.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = job.Id }, ToResponse(job));
    }

    private static JobResponse ToResponse(JobProjection job) => new()
    {
        Id = job.Id,
        Name = job.Name,
        Description = job.Description,
        DurationMinutes = (int)job.Duration.TotalMinutes,
        Images = job.Images
    };
}
