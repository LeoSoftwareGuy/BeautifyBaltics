using System.Text.Json;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
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

        var job = master.GetJobOrThrow(request.MasterJobId);

        if (job.Status == MasterJobStatus.PendingReview)
        {
            throw DomainException.WithMessage("Cannot upload images while job is pending review.");
        }      

        var events = new Events();

        foreach (var file in request.Files)
        {
            var blobFile = new BlobFileDTO(file.FileName, file, file.ContentType);
            var blobName = await blobStorageService.UploadAsync(master.Id, blobFile, cancellationToken);

            if (job.Status == MasterJobStatus.Draft)
            {
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
            else
            {
                if (master.KycStatus != KycStatus.Approved)
                {
                    throw DomainException.WithMessage("Identity verification must be approved before submitting job image changes.");
                }
                   
                var change = new MasterJobImageChangeProposed(
                    MasterJobImageId: CombGuidIdGeneration.NewGuid(),
                    MasterJobId: job.MasterJobId,
                    BlobName: blobName,
                    FileName: file.FileName,
                    FileMimeType: file.ContentType,
                    FileSize: file.Length
                );

                events.Add(new MasterChangeProposed
                {
                    AggregateId = master.Id,
                    ProposedById = master.UserId,
                    EntityId = job.MasterJobId,
                    Type = typeof(MasterJobImageChangeProposed).FullName!,
                    ProposedChange = JsonSerializer.SerializeToElement(change),
                });
            }
        }

        return (events, [new UploadMasterJobImageResponse(master.Id, job.JobId)]);
    }
}
