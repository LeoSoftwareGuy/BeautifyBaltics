using System.Text.Json;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Changeset;
using BeautifyBaltics.Persistence.Repositories.Changeset.DTOs;
using BeautifyBaltics.Persistence.Repositories.Master;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Changeset.Queries.FindChangesets;

public class FindChangesetsHandler(
    IChangesetRepository changesetRepository,
    IMasterRepository masterRepository,
    IMasterJobRepository masterJobRepository,
    IBlobStorageService<MasterAggregate.MasterProfileImage> profileImageBlobStorage,
    IBlobStorageService<MasterAggregate.MasterJobImage> jobImageBlobStorage
)
{
    private static readonly string ProfileImageType = typeof(MasterProfileImageChangeProposed).FullName!;
    private static readonly string JobImageType = typeof(MasterJobImageChangeProposed).FullName!;
    private static readonly string SubmitForReviewType = typeof(MasterJobSubmitForReviewChangeProposed).FullName!;

    private static readonly JsonSerializerOptions CamelCase = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public async Task<PagedResponse<FindChangesetsResponse>> Handle(FindChangesetsRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<ChangesetSearchDTO>();
        var result = await changesetRepository.GetPagedListAsync(search, cancellationToken);
        var pagedResponse = result.ToPagedResponse<Persistence.Projections.Changesets.Changeset, FindChangesetsResponse>();

        var masterIds = pagedResponse.Items.Select(i => i.MasterId).Distinct().ToList();
        var masters = await masterRepository.GetListByAsync(m => masterIds.Contains(m.Id), cancellationToken);
        var masterNamesById = masters.ToDictionary(m => m.Id, m => $"{m.FirstName} {m.LastName}".Trim());

        var enrichedItems = await Task.WhenAll(
            pagedResponse.Items.Select(item => EnrichAsync(item, masterNamesById, cancellationToken)));

        return pagedResponse with { Items = enrichedItems };
    }

    private async Task<FindChangesetsResponse> EnrichAsync(
        FindChangesetsResponse item,
        Dictionary<Guid, string> masterNamesById,
        CancellationToken cancellationToken)
    {
        masterNamesById.TryGetValue(item.MasterId, out var masterName);
        item = item with { MasterName = masterName };

        if (item.Type == ProfileImageType)
        {
            var change = JsonSerializer.Deserialize<MasterProfileImageChangeProposed>(item.ProposedChange);
            return item with { ImageUrl = profileImageBlobStorage.GetBlobUrl(change?.BlobName) };
        }

        if (item.Type == JobImageType)
        {
            var change = JsonSerializer.Deserialize<MasterJobImageChangeProposed>(item.ProposedChange);
            return item with { ImageUrl = jobImageBlobStorage.GetBlobUrl(change?.BlobName) };
        }

        if (item.Type == SubmitForReviewType && item.EntityId.HasValue)
        {
            var job = await masterJobRepository.GetByIdAsync(item.EntityId.Value, cancellationToken);
            if (job is null) return item;

            var imageUrls = (job.Images ?? [])
                .Select(i => jobImageBlobStorage.GetBlobUrl(i.BlobName))
                .Where(url => url is not null)
                .Select(url => url!)
                .ToList();

            var featuredImage = job.FeaturedImageId.HasValue
                ? job.Images?.FirstOrDefault(i => i.Id == job.FeaturedImageId.Value)
                : job.Images?.FirstOrDefault();

            var snapshot = new
            {
                title = job.Title,
                category = job.JobCategoryName,
                service = job.JobName,
                price = job.Price,
                durationMinutes = (int)job.Duration.TotalMinutes,
            };

            return item with
            {
                ProposedChange = JsonSerializer.SerializeToElement(snapshot, CamelCase),
                ImageUrl = featuredImage is not null ? jobImageBlobStorage.GetBlobUrl(featuredImage.BlobName) : imageUrls.FirstOrDefault(),
                ImageUrls = imageUrls,
            };
        }

        return item;
    }
}
