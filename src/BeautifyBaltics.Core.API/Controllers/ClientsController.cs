using BeautifyBaltics.Core.API.Contracts.Clients;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.ValueObjects;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Client;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[Route("clients")]
public class ClientsController(IMessageBus bus) : ApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientResponse>>> Search([FromQuery] ClientSearchDTO criteria, CancellationToken cancellationToken)
    {
        var clients = await clientRepository.SearchAsync(criteria, cancellationToken);
        return Ok(clients.Select(ToResponse));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ClientResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var client = await clientRepository.GetByIdAsync(id, cancellationToken);
        if (client is null) return NotFound();
        return Ok(ToResponse(client));
    }

    [HttpPost]
    public async Task<ActionResult<ClientResponse>> Register([FromBody] CreateClientRequest request, CancellationToken cancellationToken)
    {
        var clientId = Guid.NewGuid();
        var contacts = new ContactInformation(request.Email, request.PhoneNumber);
        commandRepository.StartStream<ClientAggregate>(new ClientRegistered(clientId, request.FirstName, request.LastName, contacts));

        await documentSession.SaveChangesAsync(cancellationToken);
        var client = await clientRepository.GetByIdAsync(clientId, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = clientId }, ToResponse(client!));
    }

    private static ClientResponse ToResponse(Client projection) => new()
    {
        Id = projection.Id,
        FirstName = projection.FirstName,
        LastName = projection.LastName,
        Email = projection.Email,
        PhoneNumber = projection.PhoneNumber
    };
}
