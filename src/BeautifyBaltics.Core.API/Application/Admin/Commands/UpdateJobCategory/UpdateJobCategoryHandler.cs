using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Job;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.UpdateJobCategory;

public class UpdateJobCategoryHandler(IJobCategoryRepository repository, ICommandRepository commandRepository)
{
    public async Task<UpdateJobCategoryResponse> Handle(UpdateJobCategoryRequest request, CancellationToken cancellationToken)
    {
        var category = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw NotFoundException.For<Domain.Documents.JobCategory>(request.Id);

        category.Rename(request.Name);

        commandRepository.Update(category);

        return new UpdateJobCategoryResponse(category.Id, category.Name);
    }
}
