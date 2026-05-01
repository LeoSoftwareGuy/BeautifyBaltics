using BeautifyBaltics.Persistence.Repositories.Job.DTOs;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Job;

public interface IJobRepository : IQueryRepository<Domain.Documents.Job, JobSearchDTO>
{
}