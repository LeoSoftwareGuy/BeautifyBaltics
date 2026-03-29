using System.Text.Json;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Changesets;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Job;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.UpdateMasterJob;

public class UpdateMasterJobEventHandler(IJobRepository jobRepository)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(UpdateMasterJobRequest request, MasterAggregate master, CancellationToken cancellationToken)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        var job = master.GetJobOrThrow(request.MasterJobId);

        if (job.Status == MasterJobStatus.PendingReview)
        {
            throw DomainException.WithMessage("Cannot update a job while it is pending review.");
        }

        var jobDefinition = await jobRepository.GetByIdAsync(request.Job.JobId, cancellationToken)
                            ?? throw NotFoundException.For<Domain.Documents.Job>(request.Job.JobId);

        if (job.Status == MasterJobStatus.Draft)
        {
            // Draft updates bypass changeset flow — no KYC guard needed here
            var directEvent = new MasterJobUpdated(
                MasterJobId: job.MasterJobId,
                MasterId: master.Id,
                JobId: request.Job.JobId,
                Price: request.Job.Price,
                Duration: TimeSpan.FromMinutes(request.Job.DurationMinutes),
                Title: request.Job.Title,
                JobCategoryId: jobDefinition.CategoryId,
                JobCategoryName: jobDefinition.CategoryName,
                JobName: jobDefinition.Name
            );
            return ([directEvent], [new UpdateMasterJobResponse(request.MasterId, request.MasterJobId)]);
        }

        if (master.KycStatus != KycStatus.Approved)
        {
            throw DomainException.WithMessage("Identity verification must be approved before submitting job changes.");
        }

        var change = new MasterJobUpdateChangeProposed(
            MasterJobId: request.MasterJobId,
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
            Type = typeof(MasterJobUpdateChangeProposed).FullName!,
            ProposedChange = JsonSerializer.SerializeToElement(change),
        };

        return ([proposed], [new UpdateMasterJobResponse(request.MasterId, request.MasterJobId)]);
    }
}
