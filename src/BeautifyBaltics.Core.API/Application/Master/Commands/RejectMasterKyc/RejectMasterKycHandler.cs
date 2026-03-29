using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.RejectMasterKyc;

public class RejectMasterKycHandler
{
    [AggregateHandler]
    public Task<Events> Handle(RejectMasterKycRequest request, MasterAggregate master, CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        if (master.KycStatus != KycStatus.Pending)
        {
            throw DomainException.WithMessage($"Master KYC is not pending. Current status: {master.KycStatus}.");
        }

        var @event = new MasterKycRejected(
            MasterId: master.Id,
            RejectedById: request.RejectedById,
            Reason: request.Reason,
            RejectedAt: DateTimeOffset.UtcNow
        );

        return Task.FromResult<Events>([@event]);
    }
}
