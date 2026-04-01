using System.Text.Json;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Domain.ValueObjects;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterProfile;

public class UpdateMasterProfileEventHandler
{
    [AggregateHandler]
    public Task<(Events, OutgoingMessages)> Handle(UpdateMasterProfileRequest request, MasterAggregate master, CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        if (master.KycStatus != KycStatus.Approved && master.KycStatus != KycStatus.Pending)
        {
            throw DomainException.WithMessage("Identity verification must be submitted before updating your profile.");
        }

        var change = new MasterProfileChangeProposed(
            FirstName: request.FirstName,
            LastName: request.LastName,
            Age: request.Age,
            Gender: request.Gender,
            Description: request.Description,
            Contacts: new ContactInformation(request.Email, request.PhoneNumber),
            Latitude: request.Latitude,
            Longitude: request.Longitude,
            City: request.City,
            Country: request.Country,
            AddressLine1: request.AddressLine1,
            AddressLine2: request.AddressLine2,
            PostalCode: request.PostalCode
        );

        var proposed = new MasterChangeProposed
        {
            AggregateId = master.Id,
            ProposedById = master.UserId,
            Type = typeof(MasterProfileChangeProposed).FullName!,
            ProposedChange = JsonSerializer.SerializeToElement(change),
        };

        return Task.FromResult<(Events, OutgoingMessages)>(([proposed], [new UpdateMasterProfileResponse(request.MasterId)]));
    }
}
