using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.Didit;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.ProcessDiditWebhook;

public class ProcessDiditWebhookHandler
{
    [AggregateHandler]
    public Events Handle(ProcessDiditWebhookRequest command, MasterAggregate master)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(command.MasterId);

        // Already in a terminal state — idempotent, ignore
        if (master.KycStatus is KycStatus.Approved or KycStatus.Rejected) return [];

        return command.Status switch
        {
            DiditVerificationStatus.Approved => [new MasterKycApproved(
                MasterId: master.Id,
                ApprovedById: null,
                ApprovedAt: DateTimeOffset.UtcNow
            )],

            DiditVerificationStatus.Declined => [new MasterKycRejected(
                MasterId: master.Id,
                RejectedById: null,
                Reason: "Identity verification was not successful. Please try again.",
                RejectedAt: DateTimeOffset.UtcNow
            )],

            DiditVerificationStatus.Abandoned => [new MasterKycSessionAbandoned(
                MasterId: master.Id,
                SessionId: command.SessionId,
                AbandonedAt: DateTimeOffset.UtcNow
            )],

            DiditVerificationStatus.Expired => [new MasterKycSessionAbandoned(
                MasterId: master.Id,
                SessionId: command.SessionId,
                AbandonedAt: DateTimeOffset.UtcNow
            )],

            // In Progress / In Review / Not Started — no state change needed
            _ => []
        };
    }
}
