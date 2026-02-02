using BeautifyBaltics.Persistence.Repositories.Job.DTOs;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Job;

public interface IJobCategoryRepository : IQueryRepository<Domain.Documents.JobCategory, JobCategorySearchDTO>;