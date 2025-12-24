using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using Marten;
using Marten.Pagination;

namespace BeautifyBaltics.Persistence.Repositories.Master
{
    public class MasterAvailabilitySlotRepository(IQuerySession session)
        : QueryRepository<MasterAvailabilitySlot, MasterAvailabilitySlotSearchDTO>(session), IMasterAvailabilitySlotRepository
    {
        public override Task<IPagedList<Projections.MasterAvailabilitySlot>> GetPagedListAsync(MasterAvailabilitySlotSearchDTO search, CancellationToken cancellationToken = default) =>
       BuildSearchQuery(search)
           .SortBy(search.SortBy, search.Ascending)
           .ToPagedListAsync(search.Page, search.PageSize, cancellationToken);

        public override Task<IReadOnlyList<Projections.MasterAvailabilitySlot>> GetListAsync(MasterAvailabilitySlotSearchDTO search, CancellationToken cancellationToken = default) =>
            BuildSearchQuery(search)
                .SortBy(search.SortBy, search.Ascending)
                .ToListAsync(cancellationToken);

        private IQueryable<Projections.MasterAvailabilitySlot> BuildSearchQuery(MasterAvailabilitySlotSearchDTO search)
        {
            var query = _session.Query<Projections.MasterAvailabilitySlot>().AsQueryable();

            return query;
        }
    }

}
