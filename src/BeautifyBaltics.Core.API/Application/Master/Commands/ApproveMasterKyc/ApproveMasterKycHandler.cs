using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.ApproveMasterKyc;

public class ApproveMasterKycHandler
{
    [AggregateHandler]
    public Task<Events> Handle(ApproveMasterKycRequest request, MasterAggregate master, CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        if (master.KycStatus != KycStatus.Pending)
        {
            throw DomainException.WithMessage($"Master KYC is not pending. Current status: {master.KycStatus}.");
        }
            
        var @event = new MasterKycApproved(
            MasterId: master.Id,
            ApprovedById: (Guid?)request.ApprovedById,
            ApprovedAt: DateTimeOffset.UtcNow
        );

        return Task.FromResult<Events>([@event]);
    }
}
