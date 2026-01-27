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
            request.MasterId,
            request.FirstName,
            request.LastName,
            request.Age,
            request.Gender,
            request.Description,
            new ContactInformation(request.Email, request.PhoneNumber),
            request.Latitude,
            request.Longitude,
            request.City,
            request.Country,
            request.AddressLine1,
            request.AddressLine2,
            request.PostalCode
        );

        return Task.FromResult<(Events, OutgoingMessages)>(([updated], [new UpdateMasterProfileResponse(request.MasterId)]));
    }
}
