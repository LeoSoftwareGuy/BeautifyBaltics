using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Integrations.Notifications;
using JasperFx.Events;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.DomainEventHandlers;

public class SendNotificationOnBookingRequestedEventHandler(
    INotificationService notificationService,
    IQuerySession querySession,
    ILogger<SendNotificationOnBookingRequestedEventHandler> logger
)
{
    public async Task Handle(IEvent<BookingCreated> @event, CancellationToken cancellationToken)
    {
        var master = await querySession.LoadAsync<Persistence.Projections.Master>(@event.Data.MasterId, cancellationToken);
        var client = await querySession.LoadAsync<Persistence.Projections.Client>(@event.Data.ClientId, cancellationToken);
        var masterJob = await querySession.LoadAsync<Persistence.Projections.MasterJob>(@event.Data.MasterJobId, cancellationToken);

        if (master is null || client is null || masterJob is null)
        {
            logger.LogWarning(
                "Cannot send booking request notification: related entities missing for Booking {BookingId}",
                @event.StreamId
            );
            return;
        }

        var context = new BookingNotificationContext(
            BookingId: @event.StreamId,
            ClientName: $"{client.FirstName} {client.LastName}",
            ClientEmail: client.Email,
            ClientPhone: client.PhoneNumber,
            MasterName: $"{master.FirstName} {master.LastName}",
            MasterEmail: master.Email,
            MasterPhone: master.PhoneNumber,
            ServiceName: masterJob.Title,
            ScheduledAt: @event.Data.ScheduledAt,
            Duration: @event.Data.Duration,
            Price: @event.Data.Price,
            LocationName: master.City
        );

        await notificationService.NotifyBookingRequestedAsync(context, cancellationToken);

        logger.LogInformation(
            "Booking request notification sent for Booking {BookingId}",
            @event.StreamId
        );
    }
}
