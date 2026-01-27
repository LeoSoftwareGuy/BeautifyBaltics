using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Integrations.Notifications;
using JasperFx.Events;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.DomainEventHandlers;

public class SendNotificationOnBookingCancelledEventHandler(
    INotificationService notificationService,
    IQuerySession querySession,
    ILogger<SendNotificationOnBookingCancelledEventHandler> logger
)
{
    public async Task Handle(IEvent<BookingCancelled> @event, CancellationToken cancellationToken)
    {
        var booking = await querySession.LoadAsync<Persistence.Projections.Booking>(
            @event.Data.BookingId,
            cancellationToken
        );

        if (booking is null)
        {
            logger.LogWarning(
                "Cannot send booking cancellation notification: Booking {BookingId} not found",
                @event.Data.BookingId
            );
            return;
        }

        var master = await querySession.LoadAsync<Persistence.Projections.Master>(booking.MasterId, cancellationToken);
        var client = await querySession.LoadAsync<Persistence.Projections.Client>(booking.ClientId, cancellationToken);

        if (master is null || client is null)
        {
            logger.LogWarning(
                "Cannot send booking cancellation notification: Master or Client not found for Booking {BookingId}",
                @event.Data.BookingId
            );
            return;
        }

        var context = new BookingNotificationContext(
            BookingId: booking.Id,
            ClientName: booking.ClientName,
            ClientEmail: client.Email,
            ClientPhone: client.PhoneNumber,
            MasterName: booking.MasterName,
            MasterEmail: master.Email,
            MasterPhone: master.PhoneNumber,
            ServiceName: booking.MasterJobTitle,
            ScheduledAt: booking.ScheduledAt,
            Duration: booking.Duration,
            Price: booking.Price,
            LocationName: booking.LocationName,
            LocationAddress: booking.LocationAddress
        );

        await notificationService.NotifyBookingCancelledAsync(context, cancellationToken);

        logger.LogInformation(
            "Booking cancellation notifications sent for Booking {BookingId}",
            @event.Data.BookingId
        );
    }
}
