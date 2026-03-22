using BeautifyBaltics.Core.API.Application.Changeset.Commands.Shared;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections.Changesets;
using BeautifyBaltics.Persistence.Repositories.Changeset;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Changeset.Commands.RejectChangeset;

public class RejectChangesetHandler(IChangesetRepository changesetRepository, MasterChangesetHandler masterChangesetHandler)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(
        RejectChangesetRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var changeset = await changesetRepository.GetByIdAsync(request.ChangesetId, cancellationToken)
            ?? throw NotFoundException.For<Persistence.Projections.Changesets.Changeset>(request.ChangesetId);

        if (changeset.Status != ChangesetStatus.Pending) throw DomainException.WithMessage("Changeset is not in a pending state.");

        await masterChangesetHandler.DeleteBlobIfImageChangesetAsync(changeset, cancellationToken);

        var rejectionEvent = new MasterChangesetRejected
        {
            AggregateId = request.MasterId,
            ChangesetId = request.ChangesetId,
            RejectedById = request.RejectedById,
            Comment = request.Comment,
        };

        var events = new Events { rejectionEvent };

        var domainRejectionEvent = masterChangesetHandler.BuildRejectionEvent(changeset, master);
        if (domainRejectionEvent is not null) events.Add(domainRejectionEvent);

        return (events, []);
    }
}
