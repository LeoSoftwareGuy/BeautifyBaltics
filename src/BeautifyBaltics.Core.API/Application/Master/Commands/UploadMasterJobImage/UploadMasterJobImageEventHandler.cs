using System.Text.Json;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
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
        CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var job = master.Jobs.SingleOrDefault(j => j.MasterJobId == request.MasterJobId)
            ?? throw DomainException.WithMessage($"Master job {request.MasterJobId} not found.");

        var events = new Events();

        foreach (var file in request.Files)
        {
            var blobFile = new BlobFileDTO(file.FileName, file, file.ContentType);
            var blobName = await blobStorageService.UploadAsync(master.Id, blobFile, cancellationToken);

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

        return (events, [new UploadMasterJobImageResponse(master.Id, job.JobId)]);
    }
}
