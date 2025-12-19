using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.UpdateStatusBooking
{
    public class UpdateStatusBookingEventHandler
    {
        [AggregateHandler]
        public async Task<(Events, OutgoingMessages)> Handle(UpdateStatusBookingRequest request, BookingAggregate booking, CancellationToken cancellationToken)
        {
            if (booking == null) throw NotFoundException.For<BookingAggregate>(request.BookingId);

            var bookingStatusUpdatedEvent = new BookingStatusChanged(
                BookingId: booking.Id,
                Status: request.Status
            );

            return (
                [bookingStatusUpdatedEvent],
                [new UpdateStatusBookingResponse(request.BookingId)]
            );
        }
    }
}
