using System.Text.Json;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
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

        var job = master.GetJobOrThrow(request.MasterJobId);

        if (job.Status != MasterJobStatus.Draft)
        {
            throw DomainException.WithMessage($"Job must be in Draft status to submit for review. Current status: {job.Status}.");
        }          

        var submittedEvent = new MasterJobSubmittedForReview(master.Id, job.MasterJobId);

        var change = new MasterJobSubmitForReviewChangeProposed(job.MasterJobId);

        var proposed = new MasterChangeProposed
        {
            AggregateId = master.Id,
            ProposedById = master.UserId,
            EntityId = job.MasterJobId,
            Type = typeof(MasterJobSubmitForReviewChangeProposed).FullName!,
            ProposedChange = JsonSerializer.SerializeToElement(change),
        };

        return Task.FromResult<(Events, OutgoingMessages)>(
            ([submittedEvent, proposed], [new SubmitMasterJobForReviewResponse(master.Id, job.MasterJobId)])
        );
    }
}
