using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.Didit;
using Microsoft.Extensions.Logging;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SyncMasterKycStatus;

public class SyncMasterKycStatusHandler(IDiditService diditService, ILogger<SyncMasterKycStatusHandler> logger)
{
    [AggregateHandler]
    public async Task<Events> Handle(
        SyncMasterKycStatusRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        // Nothing to sync if no active session or already in a terminal state
        if (string.IsNullOrEmpty(master.KycSessionId) || master.KycStatus is KycStatus.Approved) return [];

        string status;
        if (!string.IsNullOrEmpty(request.CallbackStatus))
        {
            status = request.CallbackStatus;
        }
        else
        {
            try
            {
                var session = await diditService.GetSessionAsync(master.KycSessionId, cancellationToken);
                status = session.Status;
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to fetch Didit session {SessionId} for master {MasterId}", master.KycSessionId, master.Id);
                throw;
            }
        }

        return status.ToLowerInvariant() switch
        {
            var s when s == DiditVerificationStatus.Approved.ToLowerInvariant() => [new MasterKycApproved(
                MasterId: master.Id,
                ApprovedById: null,
                ApprovedAt: DateTimeOffset.UtcNow
            )],

            var s when s == DiditVerificationStatus.Declined.ToLowerInvariant() => master.KycStatus == KycStatus.Rejected ? [] : [new MasterKycRejected(
                MasterId: master.Id,
                RejectedById: null,
                Reason: "Identity verification was not successful. Please try again.",
                RejectedAt: DateTimeOffset.UtcNow
            )],

            var s when s == DiditVerificationStatus.Abandoned.ToLowerInvariant()
                    || s == DiditVerificationStatus.Expired.ToLowerInvariant() => master.KycStatus == KycStatus.Abandoned ? [] : [new MasterKycSessionAbandoned(
                MasterId: master.Id,
                SessionId: master.KycSessionId,
                AbandonedAt: DateTimeOffset.UtcNow
            )],

            _ => []
        };
    }
}
