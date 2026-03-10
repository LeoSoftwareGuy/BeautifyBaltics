using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Domain.Documents.User;
using BeautifyBaltics.Persistence.Repositories.SeedWork;
using BeautifyBaltics.Persistence.Repositories.User;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.SetUserRole;

public class SetUserRoleHandler(IUserRepository userRepository, ICommandRepository commandRepository)
{
    public async Task<SetUserRoleResponse> Handle(SetUserRoleRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw NotFoundException.For<User>(request.UserId);

        user.SetRole(request.Role);
        commandRepository.Update(user);

        return new SetUserRoleResponse(user.Id, user.Role);
    }
}
