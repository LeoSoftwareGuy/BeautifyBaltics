using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.RescheduleBooking;

public class RescheduleBookingEventHandler
{
    [AggregateHandler]
    public (Events, OutgoingMessages) Handle(RescheduleBookingRequest request, BookingAggregate booking)
    {
        if (booking == null) throw NotFoundException.For<BookingAggregate>(request.BookingId);

        var bookingRescheduledEvent = new BookingRescheduled(
            BookingId: booking.Id,
            ScheduledAt: request.ScheduledAt,
            Duration: request.Duration
        );

        return (
            [bookingRescheduledEvent],
            [new RescheduleBookingResponse(request.BookingId)]
        );
    }
}