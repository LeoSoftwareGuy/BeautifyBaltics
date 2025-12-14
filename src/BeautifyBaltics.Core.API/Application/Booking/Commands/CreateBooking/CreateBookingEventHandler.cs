using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Master;
using BeautifyBaltics.Persistence.Repositories.SeedWork;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.CreateBooking;

public class CreateBookingEventHandler(ICommandRepository commandRepository, IMasterJobRepository masterJobRepository)
{
    public async Task<CreateBookingResponse> Handle(
        CreateBookingRequest request,
        [ReadAggregate(nameof(request.ClientId))]
            ClientAggregate? client,
        [ReadAggregate(nameof(request.MasterId))]
            MasterAggregate? master,
        CancellationToken cancellationToken
    )
    {
        if (client == null) throw NotFoundException.For<ClientAggregate>(request.ClientId);
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        if (!await masterJobRepository.ExistsByAsync(x => x.Id == request.MasterJobId, cancellationToken))
        {
            throw DomainException.WithMessage($"Master job with ID {request.MasterJobId} is not found");
        }

        var @event = new BookingCreated(
            MasterId: request.MasterId,
            ClientId: request.ClientId,
            MasterJobId: request.MasterJobId,
            ScheduledAt: request.ScheduledAt,
            Duration: request.DurationMinutes,
            Price: request.Price
        );

        var id = commandRepository.StartStream<BookingAggregate>(@event);

        return new CreateBookingResponse(id);
    }
}