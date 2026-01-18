using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Repositories.Master;
using JasperFx.Events;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Master.DomainEventHandlers
{
    public class BookMasterAvailabilityOnBookingCreatedEventHandler(IDocumentSession documentSession, IMasterAvailabilitySlotRepository masterAvailabilitySlotRepository)
    {
        public async Task Handle(IEvent<BookingCreated> @event, CancellationToken cancellationToken)
        {
            var availability = await masterAvailabilitySlotRepository.GetByIdAsync(@event.Data.MasterAvailabilitySlotId, cancellationToken);

            if (availability is null) return;

            var booking = await documentSession.Events.AggregateStreamAsync<BookingAggregate>(@event.StreamId, token: cancellationToken) ?? throw new InvalidOperationException("Booking not found.");

            if (booking.Status != Domain.Enumerations.BookingStatus.Requested) return;

            if (availability.IsBooked) return;

            var masterAvailabilityIsBookedEvent = new MasterAvailabilitySlotBooked(
                MasterId: @event.Data.MasterId,
                MasterAvailabilitySlotId: @event.Data.MasterAvailabilitySlotId,
                BookingId: booking.Id
            );

            documentSession.Events.Append(@event.Data.MasterId, masterAvailabilityIsBookedEvent);

            await documentSession.SaveChangesAsync(cancellationToken);
        }
    }
}
