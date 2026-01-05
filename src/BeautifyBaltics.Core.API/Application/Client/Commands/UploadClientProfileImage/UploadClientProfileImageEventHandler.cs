using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.UploadClientProfileImage;

public class UploadClientProfileImageEventHandler(IBlobStorageService<ClientAggregate.ClientProfileImage> blobStorageService)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(
        UploadClientProfileImageRequest request,
        ClientAggregate client,
        CancellationToken cancellationToken
    )
    {
        if (client == null) throw NotFoundException.For<ClientAggregate>(request.ClientId);

        var blobFile = new BlobFileDTO(request.Files[0].FileName, request.Files[0], request.Files[0].ContentType);

        var blobName = await blobStorageService.UploadAsync(client.Id, blobFile, cancellationToken);

        if (client.ProfileImage is { } currentImage)
        {
            await blobStorageService.DeleteAsync(currentImage.BlobName, cancellationToken);
        }

        var @event = new ClientProfileImageUploaded(
            ClientId: client.Id,
            BlobName: blobName,
            FileName: request.Files[0].FileName,
            FileMimeType: request.Files[0].ContentType,
            FileSize: request.Files[0].Length
        );

        return ([@event], [new UploadClientProfileImageResponse(client.Id)]);
    }
}
