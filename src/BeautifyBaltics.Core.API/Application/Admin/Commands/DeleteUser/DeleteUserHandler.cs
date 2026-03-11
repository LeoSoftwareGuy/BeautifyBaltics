using BeautifyBaltics.Domain.Aggregates.User;
using BeautifyBaltics.Domain.Aggregates.User.Events;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.SeedWork;
using BeautifyBaltics.Persistence.Repositories.User;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.DeleteUser;

public class DeleteUserHandler(IUserRepository userRepository, ICommandRepository commandRepository)
{
    public async Task Handle(DeleteUserRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw NotFoundException.For<UserProjection>(request.UserId);

        commandRepository.Append<UserAggregate>(user.Id, new UserDeleted(user.Id, DateTimeOffset.UtcNow));
    }
}
