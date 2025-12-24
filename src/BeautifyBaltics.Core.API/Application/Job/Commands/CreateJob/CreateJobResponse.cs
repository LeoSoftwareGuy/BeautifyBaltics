namespace BeautifyBaltics.Core.API.Application.Job.Commands.CreateJob;

public record CreateJobResponse(Guid Id)
{
    public Guid Id { get; init; } = Id;
}
