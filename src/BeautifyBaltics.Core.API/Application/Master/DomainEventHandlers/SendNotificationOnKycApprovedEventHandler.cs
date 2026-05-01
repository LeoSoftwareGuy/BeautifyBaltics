using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Integrations.Notifications;
using JasperFx.Events;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Master.DomainEventHandlers;

public class SendNotificationOnKycApprovedEventHandler(
    INotificationService notificationService,
    IQuerySession querySession,
    ILogger<SendNotificationOnKycApprovedEventHandler> logger
)
{
    public async Task Handle(IEvent<MasterKycApproved> @event, CancellationToken cancellationToken)
    {
        var master = await querySession.LoadAsync<Persistence.Projections.Master>(
            @event.Data.MasterId,
            cancellationToken
        );

        if (master is null)
        {
            logger.LogWarning(
                "Cannot send KYC approval notification: Master {MasterId} not found",
                @event.Data.MasterId
            );
            return;
        }

        var context = new KycNotificationContext(
            MasterId: master.Id,
            MasterName: $"{master.FirstName} {master.LastName}",
            MasterEmail: master.Email
        );

        await notificationService.NotifyKycApprovedAsync(context, cancellationToken);

        logger.LogInformation("KYC approval notification sent to Master {MasterId}", @event.Data.MasterId);
    }
}
