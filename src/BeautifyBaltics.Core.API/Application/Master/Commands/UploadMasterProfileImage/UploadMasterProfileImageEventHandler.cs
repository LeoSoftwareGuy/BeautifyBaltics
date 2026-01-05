using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterProfileImage;

public class UploadMasterProfileImageEventHandler(IBlobStorageService<MasterAggregate.MasterProfileImage> blobStorageService)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(
        UploadMasterProfileImageRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var blobFile = new BlobFileDTO(request.Files[0].FileName, request.Files[0], request.Files[0].ContentType);

        var blobName = await blobStorageService.UploadAsync(master.Id, blobFile, cancellationToken);

        if (master.ProfileImage is { } currentImage)
        {
            await blobStorageService.DeleteAsync(currentImage.BlobName, cancellationToken);
        }

        var @event = new MasterProfileImageUploaded(
            MasterId: master.Id,
            BlobName: blobName,
            FileName: request.Files[0].FileName,
            FileMimeType: request.Files[0].ContentType,
            FileSize: request.Files[0].Length
        );

        return ([@event], [new UploadMasterProfileImageResponse(master.Id)]);
    }
}
