using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;
using static BeautifyBaltics.Domain.Aggregates.Master.MasterAggregate;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SetMasterJobFeaturedImage;

public class SetMasterJobFeaturedImageEventHandler
{
    [AggregateHandler]
    public (Events, OutgoingMessages) Handle(SetMasterJobFeaturedImageRequest request, MasterAggregate master)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var job = master.Jobs.FirstOrDefault(j => j.MasterJobId == request.MasterJobId)
            ?? throw NotFoundException.For<MasterJob>(request.MasterJobId);

        if (request.MasterJobImageId.HasValue)
        {
            var image = job.Images.FirstOrDefault(i => i.MasterJobImageId == request.MasterJobImageId.Value)
                ?? throw NotFoundException.For<MasterJobImage>(request.MasterJobImageId.Value);
        }

        var @event = new MasterJobFeaturedImageSet(request.MasterId, request.MasterJobId, request.MasterJobImageId);

        return ([@event], [new SetMasterJobFeaturedImageResponse(request.MasterId, request.MasterJobId, request.MasterJobImageId)]);
    }
}
