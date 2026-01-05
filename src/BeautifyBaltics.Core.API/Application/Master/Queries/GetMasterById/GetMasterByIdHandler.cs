using BeautifyBaltics.Core.API.Application.Master.Queries.Shared;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Master;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterById;

public class GetMasterByIdHandler(
    IMasterRepository masterRepository,
    IMasterJobRepository jobRepository,
    IMasterAvailabilitySlotRepository availabilityRepository
)
{
    public async Task<GetMasterByIdResponse> Handle(GetMasterByIdRequest request, CancellationToken cancellationToken)
    {
        var master = await masterRepository.GetByIdAsync(request.Id, cancellationToken)
                     ?? throw NotFoundException.For<Persistence.Projections.Master>(request.Id);

        var jobs = await jobRepository.GetListByAsync(j => j.MasterId == request.Id, cancellationToken);
        var slots = await availabilityRepository.GetListByAsync(s => s.MasterId == request.Id, cancellationToken);

        return new GetMasterByIdResponse
        {
            Id = master.Id,
            FirstName = master.FirstName,
            LastName = master.LastName,
            Age = master.Age,
            Gender = master.Gender,
            Email = master.Email,
            PhoneNumber = master.PhoneNumber,
            Rating = master.Rating,
            Latitude = master.Latitude,
            Longitude = master.Longitude,
            City = master.City,
            ProfileImage = master.ProfileImageBlobName == null
                ? null
                : new FileMetadataDTO
                {
                    FileName = master.ProfileImageFileName ?? string.Empty,
                    FileMimeType = master.ProfileImageMimeType ?? string.Empty,
                    FileSize = master.ProfileImageSize ?? 0
                },
            Jobs = [.. jobs.Select(job => new MasterJobDTO
            {
                Id = job.Id,
                JobId = job.JobId,
                Title = job.Title,
                Price = job.Price,
                DurationMinutes = (int)job.Duration.TotalMinutes,
                Images = job.Images?.Select(image => new MasterJobImageDTO
                {
                    Id = image.Id,
                    FileName = image.FileName,
                    FileMimeType = image.FileMimeType,
                    FileSize = image.FileSize
                }).ToArray() ?? Array.Empty<MasterJobImageDTO>()
            })],
            Availability = [.. slots.Select(slot => new MasterAvailabilitySlotDTO
            {
                Id = slot.Id,
                StartAt = slot.StartAt,
                EndAt = slot.EndAt
            })]
        };
    }
}
