using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Client;

public interface IClientRepository : IQueryRepository<Projections.Client, ClientSearchDTO>;
