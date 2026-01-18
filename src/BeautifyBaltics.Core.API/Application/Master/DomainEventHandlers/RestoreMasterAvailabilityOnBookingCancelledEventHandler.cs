using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Repositories.Master;
using JasperFx.Events;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Master.DomainEventHandlers
{
    public class RestoreMasterAvailabilityOnBookingCancelledEventHandler(
        IDocumentSession documentSession,
        IMasterAvailabilitySlotRepository masterAvailabilitySlotRepository
    )
    {
        public async Task Handle(IEvent<BookingCancelled> @event, CancellationToken cancellationToken)
        {
            var availability = await masterAvailabilitySlotRepository.GetByIdAsync(
                @event.Data.MasterAvailabilitySlotId,
                cancellationToken
            );

            if (availability is null) return;

            if (!availability.IsBooked) return;

            var masterAvailabilityRestoredEvent = new MasterAvailabilitySlotRestored(
                MasterId: @event.Data.MasterId,
                MasterAvailabilitySlotId: @event.Data.MasterAvailabilitySlotId,
                BookingId: @event.Data.BookingId
            );

            documentSession.Events.Append(@event.Data.MasterId, masterAvailabilityRestoredEvent);

            await documentSession.SaveChangesAsync(cancellationToken);
        }
    }
}
