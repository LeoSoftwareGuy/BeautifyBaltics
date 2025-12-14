using BeautifyBaltics.Core.API.Contracts.Masters;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.ValueObjects;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master;
using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

using Marten;

using Microsoft.AspNetCore.Mvc;

namespace BeautifyBaltics.Core.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MastersController(
    IMasterRepository masterRepository,
    ICommandRepository commandRepository,
    IDocumentSession documentSession
) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MasterResponse>>> Search([FromQuery] MasterSearchDTO criteria, CancellationToken cancellationToken)
    {
        var masters = await masterRepository.SearchAsync(criteria, cancellationToken);
        return Ok(masters.Select(ToResponse));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<MasterResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var master = await masterRepository.GetByIdAsync(id, cancellationToken);
        if (master is null) return NotFound();
        return Ok(ToResponse(master));
    }

    [HttpPost]
    public async Task<ActionResult<MasterResponse>> Create([FromBody] CreateMasterRequest request, CancellationToken cancellationToken)
    {
        var masterId = Guid.NewGuid();
        var contacts = new ContactInformation(request.Email, request.PhoneNumber);

        commandRepository.StartStream<MasterAggregate>(new MasterCreated(masterId, request.FirstName, request.LastName, request.Age, request.Gender, contacts));

        foreach (var job in request.Jobs)
        {
            var offering = new MasterJobOffering(Guid.NewGuid(), job.JobId, job.Price, TimeSpan.FromMinutes(job.DurationMinutes), job.Title);
            commandRepository.Append<MasterAggregate>(masterId, new MasterJobAdded(masterId, offering));
        }

        if (request.Availability.Count > 0)
        {
            var slots = request.Availability.Select(a => new AvailabilitySlot(a.Start, a.End)).ToArray();
            commandRepository.Append<MasterAggregate>(masterId, new MasterAvailabilityDefined(masterId, slots));
        }

        await documentSession.SaveChangesAsync(cancellationToken);

        var master = await masterRepository.GetByIdAsync(masterId, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = masterId }, ToResponse(master!));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateProfile(Guid id, [FromBody] UpdateMasterProfileRequest request, CancellationToken cancellationToken)
    {
        if (!await masterRepository.ExistsAsync(id, cancellationToken)) return NotFound();

        var contacts = new ContactInformation(request.Email, request.PhoneNumber);
        commandRepository.Append<MasterAggregate>(id, new MasterProfileUpdated(id, request.FirstName, request.LastName, request.Age, request.Gender, contacts));

        await documentSession.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/jobs")]
    public async Task<ActionResult> AddJob(Guid id, [FromBody] AddMasterJobRequest request, CancellationToken cancellationToken)
    {
        if (!await masterRepository.ExistsAsync(id, cancellationToken)) return NotFound();

        var offering = new MasterJobOffering(Guid.NewGuid(), request.Job.JobId, request.Job.Price, TimeSpan.FromMinutes(request.Job.DurationMinutes), request.Job.Title);
        commandRepository.Append<MasterAggregate>(id, new MasterJobAdded(id, offering));

        await documentSession.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/availability")]
    public async Task<ActionResult> DefineAvailability(Guid id, [FromBody] DefineAvailabilityRequest request, CancellationToken cancellationToken)
    {
        if (!await masterRepository.ExistsAsync(id, cancellationToken)) return NotFound();

        var slots = request.Availability.Select(a => new AvailabilitySlot(a.Start, a.End)).ToArray();
        commandRepository.Append<MasterAggregate>(id, new MasterAvailabilityDefined(id, slots));

        await documentSession.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static MasterResponse ToResponse(Master master) => new()
    {
        Id = master.Id,
        FirstName = master.FirstName,
        LastName = master.LastName,
        Age = master.Age,
        Gender = master.Gender,
        Email = master.Email,
        PhoneNumber = master.PhoneNumber,
        Jobs = master.Jobs.Select(j => new MasterJobPayload
        {
            JobId = j.JobId,
            Title = j.Title,
            Price = j.Price,
            DurationMinutes = (int)j.Duration.TotalMinutes
        }),
        Availability = master.Availability.Select(a => new AvailabilitySlotPayload
        {
            Start = a.Start,
            End = a.End
        })
    };
}
