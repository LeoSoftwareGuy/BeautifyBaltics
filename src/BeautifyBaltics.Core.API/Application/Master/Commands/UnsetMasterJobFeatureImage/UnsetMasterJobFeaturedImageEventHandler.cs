using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UnsetMasterJobFeatureImage;

public class UnsetMasterJobFeaturedImageEventHandler
{
    [AggregateHandler]
    public (Events, OutgoingMessages) Handle(UnsetMasterJobFeaturedImageRequest request, MasterAggregate master)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var job = master.GetJobOrThrow(request.MasterJobId);
        if (job.FeaturedImageId is null) throw DomainException.WithMessage("No featured image has been selected yet.");

        var response = new UnsetMasterJobFeaturedImageResponse(request.MasterId, request.MasterJobId);
        return ([new MasterJobFeaturedImageSet(request.MasterId, request.MasterJobId, null)], [response]);
    }
}
