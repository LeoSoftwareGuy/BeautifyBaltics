using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Job.Commands.CreateJob;

public class CreateJobEventHandler(ICommandRepository commandRepository)
{
    public CreateJobResponse Handle(CreateJobRequest request, CancellationToken cancellationToken)
    {

        var job = commandRepository.Insert(new Domain.Documents.Job(
            Guid.NewGuid(),
            request.Name,
            request.Category,
            TimeSpan.FromMinutes(request.DurationMinutes),
            request.Description,
            request.Images ?? Array.Empty<string>()
        ));

        return new CreateJobResponse(job.Id);
    }
}
