using System.Text.Json;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Changeset;
using BeautifyBaltics.Persistence.Repositories.Changeset.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Changeset.Queries.FindChangesets;

public class FindChangesetsHandler(
    IChangesetRepository changesetRepository,
    IBlobStorageService<MasterAggregate.MasterProfileImage> profileImageBlobStorage,
    IBlobStorageService<MasterAggregate.MasterJobImage> jobImageBlobStorage
)
{
    private static readonly string ProfileImageType = typeof(MasterProfileImageChangeProposed).FullName!;
    private static readonly string JobImageType = typeof(MasterJobImageChangeProposed).FullName!;

    public async Task<PagedResponse<FindChangesetsResponse>> Handle(FindChangesetsRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<ChangesetSearchDTO>();
        var result = await changesetRepository.GetPagedListAsync(search, cancellationToken);
        var pagedResponse = result.ToPagedResponse<Persistence.Projections.Changesets.Changeset, FindChangesetsResponse>();

        var itemsWithImages = pagedResponse.Items.Select(item => item with
        {
            ImageUrl = ResolveImageUrl(item)
        }).ToArray();

        return pagedResponse with { Items = itemsWithImages };
    }

    private string? ResolveImageUrl(FindChangesetsResponse item)
    {
        if (item.Type == ProfileImageType)
        {
            var change = JsonSerializer.Deserialize<MasterProfileImageChangeProposed>(item.ProposedChange);
            return profileImageBlobStorage.GetBlobUrl(change?.BlobName);
        }

        if (item.Type == JobImageType)
        {
            var change = JsonSerializer.Deserialize<MasterJobImageChangeProposed>(item.ProposedChange);
            return jobImageBlobStorage.GetBlobUrl(change?.BlobName);
        }

        return null;
    }
}
