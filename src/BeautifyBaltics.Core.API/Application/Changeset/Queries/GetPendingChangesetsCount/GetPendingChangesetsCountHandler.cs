using BeautifyBaltics.Persistence.Repositories.Changeset;

namespace BeautifyBaltics.Core.API.Application.Changeset.Queries.GetPendingChangesetsCount;

public class GetPendingChangesetsCountHandler(IChangesetRepository changesetRepository)
{
    public async Task<GetPendingChangesetsCountResponse> Handle(GetPendingChangesetsCountRequest request, CancellationToken cancellationToken)
    {
        var count = await changesetRepository.GetPendingCountAsync(cancellationToken);
        return new GetPendingChangesetsCountResponse(count);
    }
}
