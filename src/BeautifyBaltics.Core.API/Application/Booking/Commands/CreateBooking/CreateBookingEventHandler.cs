using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master;
using BeautifyBaltics.Persistence.Repositories.SeedWork;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.CreateBooking;

public class CreateBookingEventHandler(
    ICommandRepository commandRepository,
    IMasterJobRepository masterJobRepository,
    IMasterAvailabilitySlotRepository masterAvailabilitySlotRepository
)
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

        var bookingCreatedEvent = new BookingCreated(
            MasterId: request.MasterId,
            ClientId: request.ClientId,
            MasterJobId: request.MasterJobId,
            MasterAvailabilitySlotId: request.MasterAvailabilityId,
            ScheduledAt: availability.StartAt,
            Duration: masterJob.Duration,
            Price: masterJob.Price
        );

        var bookingId = commandRepository.StartStream<BookingAggregate>(bookingCreatedEvent);

        return new CreateBookingResponse(bookingId);
    }
}
