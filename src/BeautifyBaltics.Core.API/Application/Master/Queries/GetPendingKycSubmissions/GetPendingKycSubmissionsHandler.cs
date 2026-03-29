using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Integrations.BlobStorage;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetPendingKycSubmissions;

public class GetPendingKycSubmissionsHandler(
    IQuerySession querySession,
    IBlobStorageService<MasterAggregate.MasterKycDocument> blobStorageService
)
{
    public async Task<GetPendingKycSubmissionsResponse> Handle(
        GetPendingKycSubmissionsRequest request,
        CancellationToken cancellationToken
    )
    {
        var masters = await querySession
            .Query<Persistence.Projections.Master>()
            .Where(m => m.KycStatus == KycStatus.Pending)
            .OrderBy(m => m.KycSubmittedAt)
            .ToListAsync(cancellationToken);

        var items = masters
            .Select(m => new PendingKycSubmissionDTO(
                MasterId: m.Id,
                FirstName: m.FirstName,
                LastName: m.LastName,
                Email: m.Email,
                DocumentUrl: blobStorageService.GetBlobUrl(m.KycDocumentBlobName),
                SubmittedAt: m.KycSubmittedAt
            ))
            .ToList();

        return new GetPendingKycSubmissionsResponse(items);
    }
}
