namespace BeautifyBaltics.Core.API.Application.Job.Queries.GetJobById;

public record GetJobByIdRequest
{
    public Guid Id { get; init; }
}
