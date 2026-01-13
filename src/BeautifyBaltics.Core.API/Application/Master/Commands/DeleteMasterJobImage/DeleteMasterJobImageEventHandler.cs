using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using Wolverine;
using Wolverine.Marten;
using static BeautifyBaltics.Domain.Aggregates.Master.MasterAggregate;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterJobImage;

public class DeleteMasterJobImageEventHandler(IBlobStorageService<MasterJobImage> blobStorageService)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(
        DeleteMasterJobImageRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var job = master.Jobs.FirstOrDefault(j => j.MasterJobId == request.MasterJobId)
            ?? throw NotFoundException.For<MasterJob>(request.MasterJobId);

        var image = job.Images.FirstOrDefault(i => i.MasterJobImageId == request.MasterJobImageId)
            ?? throw NotFoundException.For<MasterJobImage>(request.MasterJobImageId);

        await blobStorageService.DeleteAsync(image.BlobName, cancellationToken);

        var @event = new MasterJobImageDeleted(request.MasterId, request.MasterJobId, request.MasterJobImageId);

        return ([@event], [new DeleteMasterJobImageResponse(request.MasterId, request.MasterJobId, request.MasterJobImageId)]);
    }
}
