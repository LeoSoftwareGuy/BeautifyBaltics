using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterAvailabilities;

public class FindMasterAvailabilitiesHandler(IMasterRepository masterRepository, IQuerySession session)
{
    public async Task<PagedResponse<FindMasterAvailabilitiesResponse>> Handle(FindMasterAvailabilitiesRequest request, CancellationToken cancellationToken)
    {
        if (!await masterRepository.ExistsByAsync(x => x.Id == request.MasterId, cancellationToken))
            throw NotFoundException.For<Persistence.Projections.Master>(request.MasterId);

        var query = session.Query<MasterAvailabilityIndex>().Where(s => s.MasterId == request.MasterId);

        if (request.StartAt is not null)
        {
            var startAt = DateTime.SpecifyKind(request.StartAt.Value, DateTimeKind.Unspecified);
            query = query.Where(s => s.StartAt >= startAt);
        }

        if (request.EndAt is not null)
        {
            var endAt = DateTime.SpecifyKind(request.EndAt.Value, DateTimeKind.Unspecified);
            query = query.Where(s => s.EndAt <= endAt);
        }

        var result = await query
            .OrderBy(s => s.StartAt)
            .ToPagedListAsync(request.Page, request.PageSize, cancellationToken);

        var items = result
            .Select(s => new FindMasterAvailabilitiesResponse
            {
                Id = s.Id,
                MasterId = s.MasterId,
                MasterName = s.MasterName,
                StartAt = s.StartAt,
                EndAt = s.EndAt,
                SlotType = s.SlotType,
            })
            .ToArray();

        return new PagedResponse<FindMasterAvailabilitiesResponse>(
            items,
            result.PageNumber,
            result.PageSize,
            result.PageCount,
            result.TotalItemCount
        );
    }
}
