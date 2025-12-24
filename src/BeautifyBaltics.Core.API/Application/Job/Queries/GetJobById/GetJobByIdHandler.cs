using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Job;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Job.Queries.GetJobById;

public class GetJobByIdHandler(IJobRepository jobRepository)
{
    public async Task<GetJobByIdResponse> Handle(GetJobByIdRequest request, CancellationToken cancellationToken)
    {
        var result = await jobRepository.GetByIdAsync(request.Id, cancellationToken)
                  ?? throw NotFoundException.For<Domain.Documents.Job>(request.Id);

        return result.Adapt<GetJobByIdResponse>();
    }
}
