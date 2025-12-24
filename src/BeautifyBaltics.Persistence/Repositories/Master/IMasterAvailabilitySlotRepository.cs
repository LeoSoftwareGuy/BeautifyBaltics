using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Master.DTOs;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Master
{
    public interface IMasterAvailabilitySlotRepository : IQueryRepository<MasterAvailabilitySlot, MasterAvailabilitySlotSearchDTO>;
}
