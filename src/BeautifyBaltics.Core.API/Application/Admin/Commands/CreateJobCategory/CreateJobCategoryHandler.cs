using BeautifyBaltics.Domain.Documents;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.CreateJobCategory;

public class CreateJobCategoryHandler(ICommandRepository commandRepository)
{
    public CreateJobCategoryResponse Handle(CreateJobCategoryRequest request)
    {
        var category = new JobCategory(Guid.NewGuid(), request.Name);
        var inserted = commandRepository.Insert(category);
        return new CreateJobCategoryResponse(inserted.Id, inserted.Name);
    }
}
