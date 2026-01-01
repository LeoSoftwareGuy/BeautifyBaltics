using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.ValueObjects;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.CreateMaster;

public class CreateMasterEventHandler(ICommandRepository commandRepository)
{
    public CreateMasterResponse Handle(CreateMasterRequest request)
    {
        var contacts = new ContactInformation(request.Email, request.PhoneNumber);

        var @event = new MasterCreated(
            request.FirstName,
            request.LastName,
            request.Age,
            request.Gender,
            contacts,
            request.SupabaseUserId);
       
        var id = commandRepository.StartStream<MasterAggregate>(@event);

        return new CreateMasterResponse(id);
    }
}
