using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using BeautifyBaltics.Persistence.Repositories.Master;
using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using BeautifyBaltics.Persistence.Repositories.SeedWork;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.CreateBooking;

public class CreateBookingEventHandler(
    ICommandRepository commandRepository,
    IMasterJobRepository masterJobRepository,
    IMasterAvailabilitySlotRepository masterAvailabilitySlotRepository,
    IBookingRepository bookingRepository
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

        var scheduledAt = DateTime.SpecifyKind(request.ScheduledAt, DateTimeKind.Utc);
        var bookingEndAt = scheduledAt + masterJob.Duration;

        // Validate that the requested time is within master's availability
        var dayStart = scheduledAt.Date;
        var dayEnd = dayStart.AddDays(1);

        var availabilityWindows = await masterAvailabilitySlotRepository.GetListAsync(
            new MasterAvailabilitySlotSearchDTO
            {
                MasterId = request.MasterId,
                StartAt = dayStart,
                EndAt = dayEnd
            },
            cancellationToken
        );

        // Only consider Available windows (not Break slots)
        var validWindow = availabilityWindows.FirstOrDefault(w =>
            w.SlotType == AvailabilitySlotType.Available &&
            scheduledAt >= w.StartAt && bookingEndAt <= w.EndAt) ?? throw DomainException.WithMessage("The requested time is not within the master's availability window.");

        // Check for conflicts with break slots
        var hasBreakConflict = availabilityWindows
            .Where(w => w.SlotType == AvailabilitySlotType.Break)
            .Any(brk => scheduledAt < brk.EndAt && bookingEndAt > brk.StartAt);

        if (hasBreakConflict) throw DomainException.WithMessage("The requested time conflicts with the master's break time.");

        // Check for conflicts with existing bookings (with buffer time)
        var bufferTime = TimeSpan.FromMinutes(master.BufferMinutes);
        var existingBookings = await bookingRepository.GetListAsync(
            new BookingSearchDTO
            {
                MasterId = request.MasterId,
                From = dayStart,
                To = dayEnd
            },
            cancellationToken
        );

        var hasConflict = existingBookings
            .Where(b => b.Status != BookingStatus.Cancelled)
            .Any(b =>
            {
                var bookingStart = b.ScheduledAt - bufferTime;
                var bookingEnd = b.ScheduledAt + b.Duration + bufferTime;
                return scheduledAt < bookingEnd && bookingEndAt > bookingStart;
            });

        if (hasConflict) throw DomainException.WithMessage("The requested time conflicts with an existing booking.");

        var bookingCreatedEvent = new BookingCreated(
            MasterId: request.MasterId,
            ClientId: request.ClientId,
            MasterJobId: request.MasterJobId,
            ScheduledAt: scheduledAt,
            Duration: masterJob.Duration,
            Price: masterJob.Price
        );

        var bookingId = commandRepository.StartStream<BookingAggregate>(bookingCreatedEvent);

        return new CreateBookingResponse(bookingId);
    }
}
