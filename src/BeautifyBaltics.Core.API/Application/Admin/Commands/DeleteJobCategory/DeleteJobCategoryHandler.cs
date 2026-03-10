using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Job;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.DeleteJobCategory;

public class DeleteJobCategoryHandler(IJobCategoryRepository categoryRepository, IJobRepository jobRepository, ICommandRepository commandRepository)
{
    public async Task Handle(DeleteJobCategoryRequest request, CancellationToken cancellationToken)
    {
        var category = await categoryRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw NotFoundException.For<Domain.Documents.JobCategory>(request.Id);

        var hasJobs = await jobRepository.ExistsByAsync(j => j.CategoryId == request.Id, cancellationToken);
        if (hasJobs) throw DomainException.WithMessage("Cannot delete a category that has existing services.");

        commandRepository.Delete(category);
    }
}
