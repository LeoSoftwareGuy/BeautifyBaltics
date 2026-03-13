using System.Text.Json;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Persistence.Repositories.Changeset;
using BeautifyBaltics.Persistence.Repositories.Master;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterById;

public class GetMasterByIdHandler(
    IMasterRepository masterRepository,
    IChangesetRepository changesetRepository,
    IBlobStorageService<MasterAggregate.MasterProfileImage> blobStorageService
)
{
    public async Task<GetMasterByIdResponse> Handle(GetMasterByIdRequest request, CancellationToken cancellationToken)
    {
        var master = await masterRepository.GetByIdAsync(request.Id, cancellationToken)
                     ?? throw NotFoundException.For<Persistence.Projections.Master>(request.Id);

        var response = master.Adapt<GetMasterByIdResponse>();
        response = response with
        {
            ProfileImageUrl = blobStorageService.GetBlobUrl(master.ProfileImageBlobName)
        };

        if (!request.Proposal || !master.HasPendingChangesets)
            return response;

        var changesets = await changesetRepository.GetPendingByMasterAsync(request.Id, cancellationToken);

        foreach (var changeset in changesets.OrderBy(c => c.ProposedAt))
        {
            if (changeset.Type == typeof(MasterProfileChangeProposed).FullName)
            {
                var profileChange = JsonSerializer.Deserialize<MasterProfileChangeProposed>(changeset.ProposedChange);
                if (profileChange is null) continue;

                response = response with
                {
                    FirstName = profileChange.FirstName,
                    LastName = profileChange.LastName,
                    Age = profileChange.Age,
                    Gender = profileChange.Gender,
                    Description = profileChange.Description,
                    Email = profileChange.Contacts.Email,
                    PhoneNumber = profileChange.Contacts.PhoneNumber,
                    Latitude = profileChange.Latitude,
                    Longitude = profileChange.Longitude,
                    City = profileChange.City,
                    Country = profileChange.Country,
                    AddressLine1 = profileChange.AddressLine1,
                    AddressLine2 = profileChange.AddressLine2,
                    PostalCode = profileChange.PostalCode,
                };
            }
            else if (changeset.Type == typeof(MasterProfileImageChangeProposed).FullName)
            {
                var imageChange = JsonSerializer.Deserialize<MasterProfileImageChangeProposed>(changeset.ProposedChange);
                if (imageChange is null) continue;

                response = response with
                {
                    ProfileImageUrl = blobStorageService.GetBlobUrl(imageChange.BlobName)
                };
            }
        }

        return response;
    }
}
