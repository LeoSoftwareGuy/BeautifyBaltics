using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using JasperFx.Core;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterJobImage;

public class UploadMasterJobImageEventHandler(IBlobStorageService<MasterAggregate.MasterJobImage> blobStorageService)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(
        UploadMasterJobImageRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        if (master.KycStatus != KycStatus.Approved && master.KycStatus != KycStatus.Pending)
            throw DomainException.WithMessage("Identity verification must be submitted before uploading service images.");

        var job = master.GetJobOrThrow(request.MasterJobId);

        var events = new Events();

        foreach (var file in request.Files)
        {
            var blobFile = new BlobFileDTO(file.FileName, file, file.ContentType);
            var blobName = await blobStorageService.UploadAsync(master.Id, blobFile, cancellationToken);

            events.Add(new MasterJobImageUploaded(
                MasterId: master.Id,
                MasterJobId: job.MasterJobId,
                BlobName: blobName,
                FileName: file.FileName,
                FileMimeType: file.ContentType,
                FileSize: file.Length
            )
            { MasterJobImageId = CombGuidIdGeneration.NewGuid() });
        }

        return (events, [new UploadMasterJobImageResponse(master.Id, job.JobId)]);
    }
}
