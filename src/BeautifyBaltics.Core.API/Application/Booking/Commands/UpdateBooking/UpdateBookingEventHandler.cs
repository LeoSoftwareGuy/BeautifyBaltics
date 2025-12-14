using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Master;
using Marten;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.UpdateBooking;

public class UpdateBookingEventHandler(IDocumentSession session, IMasterJobRepository masterJobRepository)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(UpdateBookingRequest request, BookingAggregate booking, CancellationToken cancellationToken)
    {
        if (booking == null) throw NotFoundException.For<BookingAggregate>(request.BookingId);

        var master = await session.Events.AggregateStreamAsync<MasterAggregate>(request.MasterId, token: cancellationToken) ??
                     throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var client = await session.Events.AggregateStreamAsync<ClientAggregate>(request.ClientId, token: cancellationToken) ??
                     throw NotFoundException.For<ClientAggregate>(request.ClientId);

        if (!await masterJobRepository.ExistsByAsync(x => x.Id == request.MasterJobId, cancellationToken))
        {
            throw DomainException.WithMessage($"Master job with ID {request.MasterJobId} is not found");
        }

        var bookingUpdatedEvent = new BookingUpdated(
            BookingId: booking.Id,
            MasterId: master.Id,
            ClientId: client.Id,
            MasterJobId: request.MasterJobId,
            ScheduledAt: request.ScheduledAt,
            Duration: request.DurationMinutes,
            Price: request.Price
        );

        return (
            [bookingUpdatedEvent],
            [new UpdateBookingResponse(request.BookingId)]
        );
    }
}