using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
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

        var updated = new MasterProfileUpdated(
            MasterId: request.MasterId,
            FirstName: request.FirstName,
            LastName: request.LastName,
            Age: request.Age,
            Gender: request.Gender,
            Description: request.Description,
            new ContactInformation(request.Email, request.PhoneNumber),
            Latitude: request.Latitude,
            Longitude: request.Longitude,
            City: request.City,
            Country: request.Country,
            AddressLine1: request.AddressLine1,
            AddressLine2: request.AddressLine2,
            PostalCode: request.PostalCode
        );

        return Task.FromResult<(Events, OutgoingMessages)>(([updated], [new UpdateMasterProfileResponse(request.MasterId)]));
    }
}
