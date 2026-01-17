using BeautifyBaltics.Core.API.Application.Master.Queries.Shared;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Master;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterJobs;

public class FindMasterJobsHandler(
    IMasterRepository masterRepository,
    IMasterJobRepository masterJobRepository,
    IBlobStorageService<MasterJobImage> blobStorageService
)
{
    public async Task<FindMasterJobsResponse> Handle(FindMasterJobsRequest request, CancellationToken cancellationToken)
    {
        if (!await masterRepository.ExistsByAsync(x => x.Id == request.MasterId, cancellationToken)) throw NotFoundException.For<Persistence.Projections.Master>(request.MasterId);

        var jobs = await masterJobRepository.GetListByAsync(j => j.MasterId == request.MasterId, cancellationToken);

        return new FindMasterJobsResponse
        {
            Jobs = [.. jobs.Select(job => new MasterJobDTO
            {
                Id = job.Id,
                JobId = job.JobId,
                JobCategoryId = job.JobCategoryId,
                JobCategoryName = job.JobCategoryName,
                JobName = job.JobName,
                Title = job.Title,
                Price = job.Price,
                DurationMinutes = (int)job.Duration.TotalMinutes,
                Images = job.Images?.Select(image => new MasterJobImageDTO
                {
                    Id = image.Id,
                    FileName = image.FileName,
                    FileMimeType = image.FileMimeType,
                    FileSize = image.FileSize,
                    Url = blobStorageService.GetBlobUrl(image.BlobName) ?? string.Empty
                }).ToArray() ?? []
            })]
        };
    }
}
