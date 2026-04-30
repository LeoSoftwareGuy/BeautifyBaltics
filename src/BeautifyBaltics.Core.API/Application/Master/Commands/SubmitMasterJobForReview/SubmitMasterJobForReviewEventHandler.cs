using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SubmitMasterJobForReview;

public class SubmitMasterJobForReviewEventHandler
{
    [AggregateHandler]
    public Task<(Events, OutgoingMessages)> Handle(
        SubmitMasterJobForReviewRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        if (master.KycStatus != KycStatus.Approved)
        {
            throw DomainException.WithMessage("Identity verification must be approved before submitting jobs for review.");
        }

        var job = master.GetJobOrThrow(request.MasterJobId);

        if (job.Status != MasterJobStatus.Draft)
        {
            throw DomainException.WithMessage($"Job must be in Draft status to submit for review. Current status: {job.Status}.");
        }

        var activatedEvent = new MasterJobActivated(master.Id, job.MasterJobId);

        return Task.FromResult<(Events, OutgoingMessages)>(
            ([activatedEvent], [new SubmitMasterJobForReviewResponse(master.Id, job.MasterJobId)])
        );
    }
}
