using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SubmitMasterKyc;

public class SubmitMasterKycHandler(IBlobStorageService<MasterAggregate.MasterKycDocument> blobStorageService)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(
        SubmitMasterKycRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        if (master.KycStatus == KycStatus.Approved)
        {
            throw DomainException.WithMessage("Identity verification has already been approved.");
        }

        if (master.KycDocumentBlobName is not null)
        {
            await blobStorageService.DeleteAsync(master.KycDocumentBlobName, cancellationToken);
        }

        var file = request.Files[0];
        var blobFile = new BlobFileDTO(file.FileName, file, file.ContentType);
        var blobName = await blobStorageService.UploadAsync(master.Id, blobFile, cancellationToken);

        var @event = new MasterKycSubmitted(
            MasterId: master.Id,
            BlobName: blobName,
            FileName: file.FileName,
            FileMimeType: file.ContentType,
            FileSize: file.Length,
            SubmittedAt: DateTimeOffset.UtcNow
        );

        return ([@event], [new SubmitMasterKycResponse(master.Id)]);
    }
}
