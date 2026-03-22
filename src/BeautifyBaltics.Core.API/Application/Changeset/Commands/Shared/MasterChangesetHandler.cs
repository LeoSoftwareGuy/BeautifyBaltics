using System.Text.Json;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Integrations.BlobStorage;

namespace BeautifyBaltics.Core.API.Application.Changeset.Commands.Shared;

public class MasterChangesetHandler(
    IBlobStorageService<MasterAggregate.MasterProfileImage> profileImageBlobStorage,
    IBlobStorageService<MasterAggregate.MasterJobImage> jobImageBlobStorage
)
{
    /// <summary>
    /// Deserializes the proposed change and returns the real domain event to apply,
    /// plus whether this approval should also activate the master (first-time profile).
    /// </summary>
    public async Task<(object RealEvent, bool ShouldActivate)> BuildApprovalEventAsync(
        Persistence.Projections.Changesets.Changeset changeset,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (changeset.Type == typeof(MasterProfileChangeProposed).FullName)
        {
            var change = changeset.ProposedChange.Deserialize<MasterProfileChangeProposed>()!;
            var realEvent = new MasterProfileUpdated(
                MasterId: master.Id,
                FirstName: change.FirstName,
                LastName: change.LastName,
                Age: change.Age,
                Gender: change.Gender,
                Description: change.Description,
                Contacts: change.Contacts,
                Latitude: change.Latitude,
                Longitude: change.Longitude,
                City: change.City,
                Country: change.Country,
                AddressLine1: change.AddressLine1,
                AddressLine2: change.AddressLine2,
                PostalCode: change.PostalCode
            );
            return (realEvent, !master.IsVisible);
        }

        if (changeset.Type == typeof(MasterProfileImageChangeProposed).FullName)
        {
            var change = changeset.ProposedChange.Deserialize<MasterProfileImageChangeProposed>()!;

            if (master.ProfileImage is { } oldImage) await profileImageBlobStorage.DeleteAsync(oldImage.BlobName, cancellationToken);

            var realEvent = new MasterProfileImageUploaded(
                MasterId: master.Id,
                BlobName: change.BlobName,
                FileName: change.FileName,
                FileMimeType: change.FileMimeType,
                FileSize: change.FileSize
            )
            { MasterProfileImageId = change.MasterProfileImageId };

            return (realEvent, false);
        }

        if (changeset.Type == typeof(MasterJobCreateChangeProposed).FullName)
        {
            var change = changeset.ProposedChange.Deserialize<MasterJobCreateChangeProposed>()!;
            var realEvent = new MasterJobCreated(
                MasterId: master.Id,
                JobId: change.JobId,
                Price: change.Price,
                Duration: change.Duration,
                Title: change.Title,
                JobCategoryId: change.JobCategoryId,
                JobCategoryName: change.JobCategoryName,
                JobName: change.JobName
            )
            { MasterJobId = change.MasterJobId };

            return (realEvent, false);
        }

        if (changeset.Type == typeof(MasterJobUpdateChangeProposed).FullName)
        {
            var change = changeset.ProposedChange.Deserialize<MasterJobUpdateChangeProposed>()!;
            var realEvent = new MasterJobUpdated(
                MasterJobId: change.MasterJobId,
                MasterId: master.Id,
                JobId: change.JobId,
                Price: change.Price,
                Duration: change.Duration,
                Title: change.Title,
                JobCategoryId: change.JobCategoryId,
                JobCategoryName: change.JobCategoryName,
                JobName: change.JobName
            );

            return (realEvent, false);
        }

        if (changeset.Type == typeof(MasterJobImageChangeProposed).FullName)
        {
            var change = changeset.ProposedChange.Deserialize<MasterJobImageChangeProposed>()!;
            var realEvent = new MasterJobImageUploaded(
                MasterId: master.Id,
                MasterJobId: change.MasterJobId,
                BlobName: change.BlobName,
                FileName: change.FileName,
                FileMimeType: change.FileMimeType,
                FileSize: change.FileSize
            )
            { MasterJobImageId = change.MasterJobImageId };

            return (realEvent, false);
        }

        if (changeset.Type == typeof(MasterJobSubmitForReviewChangeProposed).FullName)
        {
            var change = changeset.ProposedChange.Deserialize<MasterJobSubmitForReviewChangeProposed>()!;
            var realEvent = new MasterJobActivated(master.Id, change.MasterJobId);
            return (realEvent, false);
        }

        throw new InvalidOperationException($"Unknown changeset type: {changeset.Type}");
    }

    /// <summary>
    /// Returns the domain rejection event for changesets that require one, or null if none is needed.
    /// </summary>
    public object? BuildRejectionEvent(
        Persistence.Projections.Changesets.Changeset changeset,
        MasterAggregate master)
    {
        if (changeset.Type == typeof(MasterJobSubmitForReviewChangeProposed).FullName)
        {
            var change = changeset.ProposedChange.Deserialize<MasterJobSubmitForReviewChangeProposed>()!;
            return new MasterJobDeclined(master.Id, change.MasterJobId);
        }

        return null;
    }

    /// <summary>
    /// Deletes the blob associated with a rejected image changeset so storage is not wasted.
    /// </summary>
    public async Task DeleteBlobIfImageChangesetAsync(
        Persistence.Projections.Changesets.Changeset changeset,
        CancellationToken cancellationToken)
    {
        if (changeset.Type == typeof(MasterProfileImageChangeProposed).FullName)
        {
            var change = changeset.ProposedChange.Deserialize<MasterProfileImageChangeProposed>()!;
            await profileImageBlobStorage.DeleteAsync(change.BlobName, cancellationToken);
            return;
        }

        if (changeset.Type == typeof(MasterJobImageChangeProposed).FullName)
        {
            var change = changeset.ProposedChange.Deserialize<MasterJobImageChangeProposed>()!;
            await jobImageBlobStorage.DeleteAsync(change.BlobName, cancellationToken);
        }
    }
}
