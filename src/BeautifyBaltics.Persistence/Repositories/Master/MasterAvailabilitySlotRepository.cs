using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Master
{
    public class MasterAvailabilitySlotRepository(IQuerySession session)
        : QueryRepository<MasterAvailabilitySlot, MasterAvailabilitySlotSearchDTO>(session), IMasterAvailabilitySlotRepository
    {
        public override Task<IPagedList<MasterAvailabilitySlot>> GetPagedListAsync(MasterAvailabilitySlotSearchDTO search, CancellationToken cancellationToken = default) =>
       BuildSearchQuery(search)
           .SortBy(search.SortBy, search.Ascending)
           .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

        public override Task<IReadOnlyList<MasterAvailabilitySlot>> GetListAsync(MasterAvailabilitySlotSearchDTO search, CancellationToken cancellationToken = default) =>
            BuildSearchQuery(search)
                .SortBy(search.SortBy, search.Ascending)
                .ToListAsync(cancellationToken);

        private IQueryable<MasterAvailabilitySlot> BuildSearchQuery(MasterAvailabilitySlotSearchDTO search)
        {
            var query = _session.Query<MasterAvailabilitySlot>().AsQueryable();

            query = query.Where(x => x.MasterId == search.MasterId);

            if (search.StartAt is not null)
            {
                var startAt = DateTime.SpecifyKind(search.StartAt.Value, DateTimeKind.Unspecified);
                query = query.Where(x => x.StartAt >= startAt);
            }

            if (search.EndAt is not null)
            {
                var endAt = DateTime.SpecifyKind(search.EndAt.Value, DateTimeKind.Unspecified);
                query = query.Where(x => x.EndAt <= endAt);
            }

            return query;
        }
    }

}
