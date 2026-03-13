using System.Text.Json;
using BeautifyBaltics.Core.API.Application.Master.Queries.Shared;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Projections.Changesets;
using BeautifyBaltics.Persistence.Repositories.Changeset;
using BeautifyBaltics.Persistence.Repositories.Master;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterJobs;

public class FindMasterJobsHandler(
    IMasterRepository masterRepository,
    IMasterJobRepository masterJobRepository,
    IChangesetRepository changesetRepository,
    IBlobStorageService<MasterAggregate.MasterJobImage> blobStorageService
)
{
    private static readonly string JobCreateType = typeof(MasterJobCreateChangeProposed).FullName!;
    private static readonly string JobUpdateType = typeof(MasterJobUpdateChangeProposed).FullName!;
    private static readonly string JobImageType = typeof(MasterJobImageChangeProposed).FullName!;

    public async Task<FindMasterJobsResponse> Handle(FindMasterJobsRequest request, CancellationToken cancellationToken)
    {
        if (!await masterRepository.ExistsByAsync(x => x.Id == request.MasterId, cancellationToken))
            throw NotFoundException.For<Persistence.Projections.Master>(request.MasterId);

        var jobs = await masterJobRepository.GetListByAsync(j => j.MasterId == request.MasterId, cancellationToken);

        var jobDtos = jobs.Select(job => new MasterJobDTO
        {
            Id = job.Id,
            JobId = job.JobId,
            JobCategoryId = job.JobCategoryId,
            JobCategoryName = job.JobCategoryName,
            JobName = job.JobName,
            Title = job.Title,
            Price = job.Price,
            DurationMinutes = (int)job.Duration.TotalMinutes,
            FeaturedImageId = job.FeaturedImageId,
            FeaturedImageFocusX = job.FeaturedImageFocusX,
            FeaturedImageFocusY = job.FeaturedImageFocusY,
            FeaturedImageZoom = job.FeaturedImageZoom,
            Images = job.Images?.Select(image => new MasterJobImageDTO
            {
                Id = image.Id,
                FileName = image.FileName,
                FileMimeType = image.FileMimeType,
                FileSize = image.FileSize,
                Url = blobStorageService.GetBlobUrl(image.BlobName) ?? string.Empty
            }).ToArray() ?? []
        });

        if (!request.Proposal)
            return new FindMasterJobsResponse { Jobs = [.. jobDtos] };

        var changesets = await changesetRepository.GetPendingByMasterAsync(request.MasterId, cancellationToken);
        return new FindMasterJobsResponse { Jobs = [.. ApplyChangesets(jobDtos, changesets)] };
    }

    private IEnumerable<MasterJobDTO> ApplyChangesets(
        IEnumerable<MasterJobDTO> jobs,
        IReadOnlyList<Changeset> changesets)
    {
        var jobsById = jobs.ToDictionary(j => j.Id);

        foreach (var changeset in changesets.OrderBy(c => c.ProposedAt))
        {
            if (changeset.Type == JobCreateType)
            {
                var c = JsonSerializer.Deserialize<MasterJobCreateChangeProposed>(changeset.ProposedChange);
                if (c is null) continue;

                jobsById[c.MasterJobId] = new MasterJobDTO
                {
                    Id = c.MasterJobId,
                    JobId = c.JobId,
                    JobCategoryId = c.JobCategoryId,
                    JobCategoryName = c.JobCategoryName,
                    JobName = c.JobName,
                    Title = c.Title,
                    Price = c.Price,
                    DurationMinutes = (int)c.Duration.TotalMinutes,
                    Images = []
                };
            }
            else if (changeset.Type == JobUpdateType)
            {
                var c = JsonSerializer.Deserialize<MasterJobUpdateChangeProposed>(changeset.ProposedChange);
                if (c is null || !jobsById.TryGetValue(c.MasterJobId, out var existing)) continue;

                jobsById[c.MasterJobId] = existing with
                {
                    Title = c.Title,
                    Price = c.Price,
                    DurationMinutes = (int)c.Duration.TotalMinutes,
                    JobCategoryId = c.JobCategoryId,
                    JobCategoryName = c.JobCategoryName,
                    JobName = c.JobName,
                };
            }
            else if (changeset.Type == JobImageType)
            {
                var c = JsonSerializer.Deserialize<MasterJobImageChangeProposed>(changeset.ProposedChange);
                if (c is null || !jobsById.TryGetValue(c.MasterJobId, out var existing)) continue;

                var newImage = new MasterJobImageDTO
                {
                    Id = c.MasterJobImageId,
                    FileName = c.FileName,
                    FileMimeType = c.FileMimeType,
                    FileSize = c.FileSize,
                    Url = blobStorageService.GetBlobUrl(c.BlobName) ?? string.Empty
                };

                jobsById[c.MasterJobId] = existing with
                {
                    Images = [.. existing.Images, newImage]
                };
            }
        }

        return jobsById.Values;
    }
}
