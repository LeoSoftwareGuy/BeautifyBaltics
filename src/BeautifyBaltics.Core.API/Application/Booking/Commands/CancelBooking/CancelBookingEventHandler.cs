using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.Commands.CancelBooking
{
    public class CancelBookingEventHandler
    {
        [AggregateHandler]
        public (Events, OutgoingMessages) Handle(
            CancelBookingRequest request,
            [ReadAggregate(nameof(request.BookingId))]
            BookingAggregate? booking,
            CancellationToken cancellationToken
        )
        {
            if (booking == null) throw NotFoundException.For<BookingAggregate>(request.BookingId);

            if (request.MasterId.HasValue && booking.MasterId != request.MasterId.Value)
            {
                throw DomainException.WithMessage($"Master with ID {request.MasterId} is not authorized to cancel this booking.");
            }

            if (request.ClientId.HasValue && booking.ClientId != request.ClientId.Value)
            {
                throw DomainException.WithMessage($"Client with ID {request.ClientId} is not authorized to cancel this booking.");
            }

            if (booking.Status == BookingStatus.Cancelled) throw DomainException.WithMessage("Booking is already cancelled.");

            if (booking.Status == BookingStatus.Completed) throw DomainException.WithMessage("Cannot cancel a completed booking.");

            if (booking.Has24HoursPassed()) throw DomainException.WithMessage($"Booking cannot be cancelled less than 24 hours before the scheduled time.");

            var bookingCancelledEvent = new BookingCancelled(
                BookingId: request.BookingId,
                MasterId: booking.MasterId,
                CancelledByMasterId: request.MasterId,
                CancelledByClientId: request.ClientId
            );

            return ([bookingCancelledEvent], [new CancelBookingResponse(booking.Id)]);
        }
    }
}
