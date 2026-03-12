using System.Text.Json;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Job;
using JasperFx.Core;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.AddMasterJob;

public class CreateMasterJobEventHandler(IJobRepository jobRepository)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(CreateMasterJobRequest request, MasterAggregate master, CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var jobDefinition = await jobRepository.GetByIdAsync(request.Job.JobId, cancellationToken)
                            ?? throw NotFoundException.For<Domain.Documents.Job>(request.Job.JobId);

        var change = new MasterJobCreateChangeProposed(
            MasterJobId: CombGuidIdGeneration.NewGuid(),
            JobId: request.Job.JobId,
            Price: request.Job.Price,
            Duration: TimeSpan.FromMinutes(request.Job.DurationMinutes),
            Title: request.Job.Title,
            JobCategoryId: jobDefinition.CategoryId,
            JobCategoryName: jobDefinition.CategoryName,
            JobName: jobDefinition.Name
        );

        var proposed = new MasterChangeProposed
        {
            AggregateId = master.Id,
            ProposedById = master.UserId,
            Type = typeof(MasterJobCreateChangeProposed).FullName!,
            ProposedChange = JsonSerializer.SerializeToElement(change),
        };

        return ([proposed], [new CreateMasterJobResponse(request.MasterId, change.MasterJobId)]);
    }
}
