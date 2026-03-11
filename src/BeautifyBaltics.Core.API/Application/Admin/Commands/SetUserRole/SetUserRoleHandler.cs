using BeautifyBaltics.Domain.Aggregates.User;
using BeautifyBaltics.Domain.Aggregates.User.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.SeedWork;
using BeautifyBaltics.Persistence.Repositories.User;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.SetUserRole;

public class SetUserRoleHandler(IUserRepository userRepository, ICommandRepository commandRepository)
{
    public async Task<SetUserRoleResponse> Handle(SetUserRoleRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw NotFoundException.For<UserProjection>(request.UserId);

        if (user.Role == request.Role)
        {
            return new SetUserRoleResponse(user.Id, user.Role);
        }

        commandRepository.Append<UserAggregate>(user.Id, new UserRoleChanged(user.Id, request.Role));

        return new SetUserRoleResponse(user.Id, request.Role);
    }
}
