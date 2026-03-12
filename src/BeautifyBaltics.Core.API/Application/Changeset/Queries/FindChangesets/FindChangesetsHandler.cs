using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Repositories.Changeset;
using BeautifyBaltics.Persistence.Repositories.Changeset.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Changeset.Queries.FindChangesets;

public class FindChangesetsHandler(IChangesetRepository changesetRepository)
{
    public async Task<PagedResponse<FindChangesetsResponse>> Handle(FindChangesetsRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<ChangesetSearchDTO>();
        var result = await changesetRepository.GetPagedListAsync(search, cancellationToken);
        return result.ToPagedResponse<Persistence.Projections.Changesets.Changeset, FindChangesetsResponse>();
    }
}
