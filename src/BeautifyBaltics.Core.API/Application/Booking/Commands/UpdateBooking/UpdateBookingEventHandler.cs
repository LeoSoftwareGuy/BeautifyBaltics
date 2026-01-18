using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.UpdateBooking;

public class UpdateBookingEventHandler(IMasterAvailabilitySlotRepository masterAvailabilitySlotRepository, IMasterJobRepository masterJobRepository)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(UpdateBookingRequest request,
        [ReadAggregate(nameof(request.BookingId))]
        BookingAggregate booking,
        [ReadAggregate(nameof(request.ClientId))]
        ClientAggregate? client,
        [ReadAggregate(nameof(request.MasterId))]
        MasterAggregate? master, 
        CancellationToken cancellationToken
    )
    {
        if (booking == null) throw NotFoundException.For<BookingAggregate>(request.BookingId);
        if (client == null) throw NotFoundException.For<ClientAggregate>(request.ClientId);
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var masterJob = await masterJobRepository.GetByIdAsync(request.MasterJobId, cancellationToken)
                  ?? throw NotFoundException.For<MasterJob>(request.MasterJobId);

        if (masterJob.MasterId != request.MasterId)
        {
            throw DomainException.WithMessage($"Master job with ID {request.MasterJobId} does not belong to master {request.MasterId}");
        }

        var availability = await masterAvailabilitySlotRepository.GetByIdAsync(request.MasterAvailabilityId, cancellationToken)
            ?? throw NotFoundException.For<MasterAvailabilitySlot>(request.MasterAvailabilityId);

        if (availability.MasterId != request.MasterId)
        {
            throw DomainException.WithMessage($"Availability slot with ID {request.MasterAvailabilityId} does not belong to master {request.MasterId}");
        }

        var bookingUpdatedEvent = new BookingUpdated(
            BookingId: booking.Id,
            MasterId: master.Id,
            ClientId: client.Id,
            MasterJobId: request.MasterJobId,
            ScheduledAt: availability.StartAt,
            Duration: masterJob.Duration,
            Price: masterJob.Price
        );

        return (
            [bookingUpdatedEvent],
            [new UpdateBookingResponse(request.BookingId)]
        );
    }
}