using BeautifyBaltics.Domain.Aggregates.Master;
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

        if (master.KycStatus != KycStatus.Approved && master.KycStatus != KycStatus.Pending)
        {
            throw DomainException.WithMessage("Identity verification must be submitted before uploading a profile image.");
        }

        if (master.ProfileImage is { } oldImage)
            await blobStorageService.DeleteAsync(oldImage.BlobName, cancellationToken);

        var blobFile = new BlobFileDTO(request.Files[0].FileName, request.Files[0], request.Files[0].ContentType);
        var blobName = await blobStorageService.UploadAsync(master.Id, blobFile, cancellationToken);

        var @event = new MasterProfileImageUploaded(
            MasterId: master.Id,
            BlobName: blobName,
            FileName: request.Files[0].FileName,
            FileMimeType: request.Files[0].ContentType,
            FileSize: request.Files[0].Length
        )
        { MasterProfileImageId = CombGuidIdGeneration.NewGuid() };

        return ([@event], [new UploadMasterProfileImageResponse(master.Id)]);
    }
}
