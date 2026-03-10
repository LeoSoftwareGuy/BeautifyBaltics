using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Domain.Documents.User;
using BeautifyBaltics.Persistence.Repositories.SeedWork;
using BeautifyBaltics.Persistence.Repositories.User;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.DeleteUser;

public class DeleteUserHandler(IUserRepository userRepository, ICommandRepository commandRepository)
{
    public async Task Handle(DeleteUserRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw NotFoundException.For<User>(request.UserId);

        commandRepository.Delete(user);
    }
}
