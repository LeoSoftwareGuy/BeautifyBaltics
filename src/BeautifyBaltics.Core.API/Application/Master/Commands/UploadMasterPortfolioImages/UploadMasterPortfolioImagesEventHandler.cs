using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterPortfolioImages;

public class UploadMasterPortfolioImagesEventHandler(IBlobStorageService<MasterAggregate.MasterPortfolioImage> blobStorageService)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(
        UploadMasterPortfolioImagesRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var events = new Events();

        foreach (var file in request.Files)
        {
            var blobFile = new BlobFileDTO(file.FileName, file, file.ContentType);

            var blobName = await blobStorageService.UploadAsync(master.Id, blobFile, cancellationToken);

            events.Add(new MasterPortfolioImageUploaded(
                MasterId: master.Id,
                BlobName: blobName,
                FileName: file.FileName,
                FileMimeType: file.ContentType,
                FileSize: file.Length
            ));
        }

        return (events, [new UploadMasterPortfolioImagesResponse(master.Id)]);
    }
}
