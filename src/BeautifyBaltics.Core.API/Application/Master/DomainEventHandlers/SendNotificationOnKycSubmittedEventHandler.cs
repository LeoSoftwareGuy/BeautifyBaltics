using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Integrations.Notifications;
using JasperFx.Events;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Master.DomainEventHandlers;

public class SendNotificationOnKycSubmittedEventHandler(
    INotificationService notificationService,
    IQuerySession querySession,
    ILogger<SendNotificationOnKycSubmittedEventHandler> logger
)
{
    public async Task Handle(IEvent<MasterKycSubmitted> @event, CancellationToken cancellationToken)
    {
        var master = await querySession.LoadAsync<Persistence.Projections.Master>(
            @event.Data.MasterId,
            cancellationToken
        );

        if (master is null)
        {
            logger.LogWarning(
                "Cannot send KYC submission notification: Master {MasterId} not found",
                @event.Data.MasterId
            );
            return;
        }

        var context = new KycNotificationContext(
            MasterId: master.Id,
            MasterName: $"{master.FirstName} {master.LastName}",
            MasterEmail: master.Email
        );

        await notificationService.NotifyAdminKycSubmittedAsync(context, cancellationToken);

        logger.LogInformation("KYC submission notification sent to admin for Master {MasterId}", @event.Data.MasterId);
    }
}
