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

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UploadMasterProfileImage;

public class UploadMasterProfileImageEventHandler(IBlobStorageService<MasterAggregate.MasterProfileImage> blobStorageService)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(
        UploadMasterProfileImageRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        if (master.KycStatus != KycStatus.Approved)
        {
            throw DomainException.WithMessage("Identity verification must be approved before submitting profile changes.");
        }

        var blobFile = new BlobFileDTO(request.Files[0].FileName, request.Files[0], request.Files[0].ContentType);
        var blobName = await blobStorageService.UploadAsync(master.Id, blobFile, cancellationToken);

        var change = new MasterProfileImageChangeProposed(
            MasterProfileImageId: CombGuidIdGeneration.NewGuid(),
            BlobName: blobName,
            FileName: request.Files[0].FileName,
            FileMimeType: request.Files[0].ContentType,
            FileSize: request.Files[0].Length
        );

        var proposed = new MasterChangeProposed
        {
            AggregateId = master.Id,
            ProposedById = master.UserId,
            Type = typeof(MasterProfileImageChangeProposed).FullName!,
            ProposedChange = JsonSerializer.SerializeToElement(change),
        };

        return ([proposed], [new UploadMasterProfileImageResponse(master.Id)]);
    }
}
