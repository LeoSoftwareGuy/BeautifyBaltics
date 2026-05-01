using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Integrations.Notifications;
using JasperFx.Events;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Master.DomainEventHandlers;

public class SendNotificationOnKycRejectedEventHandler(
    INotificationService notificationService,
    IQuerySession querySession,
    ILogger<SendNotificationOnKycRejectedEventHandler> logger
)
{
    public async Task Handle(IEvent<MasterKycRejected> @event, CancellationToken cancellationToken)
    {
        var master = await querySession.LoadAsync<Persistence.Projections.Master>(
            @event.Data.MasterId,
            cancellationToken
        );

        if (master is null)
        {
            logger.LogWarning(
                "Cannot send KYC rejection notification: Master {MasterId} not found",
                @event.Data.MasterId
            );
            return;
        }

        var context = new KycNotificationContext(
            MasterId: master.Id,
            MasterName: $"{master.FirstName} {master.LastName}",
            MasterEmail: master.Email,
            RejectionReason: @event.Data.Reason
        );

        await notificationService.NotifyKycRejectedAsync(context, cancellationToken);

        logger.LogInformation("KYC rejection notification sent to Master {MasterId}", @event.Data.MasterId);
    }
}
