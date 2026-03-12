using BeautifyBaltics.Core.API.Application.Changeset.Commands.Shared;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections.Changesets;
using BeautifyBaltics.Persistence.Repositories.Changeset;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Changeset.Commands.ApproveChangeset;

public class ApproveChangesetHandler(IChangesetRepository changesetRepository, MasterChangesetHandler masterChangesetHandler)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(
        ApproveChangesetRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var changeset = await changesetRepository.GetByIdAsync(request.ChangesetId, cancellationToken)
            ?? throw NotFoundException.For<Persistence.Projections.Changesets.Changeset>(request.ChangesetId);

        if (changeset.Status != ChangesetStatus.Pending) throw DomainException.WithMessage("Changeset is not in a pending state.");

        var (realEvent, shouldActivate) = await masterChangesetHandler.BuildApprovalEventAsync(changeset, master, cancellationToken);

        var approvalEvent = new MasterChangesetApproved
        {
            AggregateId = request.MasterId,
            ChangesetId = request.ChangesetId,
            ApprovedById = request.ApprovedById,
            Comment = request.Comment,
        };

        var events = new Events { realEvent, approvalEvent };

        if (shouldActivate) events.Add(new MasterActivated(request.MasterId));

        return (events, []);
    }
}
