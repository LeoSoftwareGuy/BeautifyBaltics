using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.ConfirmBooking
{
    public class ConfirmBookingEventHandler
    {
        [AggregateHandler]
        public async Task<(Events, OutgoingMessages)> Handle(
            ConfirmBookingRequest request,
            [ReadAggregate(nameof(request.BookingId))]
            BookingAggregate booking,
            [ReadAggregate(nameof(request.MasterId))]
            MasterAggregate master,
            CancellationToken cancellationToken
        )
        {
            if (booking == null) throw NotFoundException.For<BookingAggregate>(request.BookingId);
            if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

            if (booking.MasterId != request.MasterId) throw DomainException.WithMessage($"Master with ID {request.MasterId} is not authorized to confirm this booking.");

            if (booking.Status != Domain.Enumerations.BookingStatus.Requested) throw DomainException.WithMessage("Only bookings with status 'Requested' can be confirmed.");

            var bookingConfirmedEvent = new BookingConfirmed(
                BookingId: request.BookingId,
                MasterId: request.MasterId
            );

            return ([bookingConfirmedEvent], [new ConfirmBookingResponse(booking.Id)]);
        }
    }
}
