using BeautifyBaltics.Core.API.Application.Users.Queries.UserProfile;
using BeautifyBaltics.Domain.Documents;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Client;
using BeautifyBaltics.Persistence.Repositories.Master;

using Marten;

namespace BeautifyBaltics.Core.API.Application.Users.Queries.GetUser
{
    public class GetUserHandler(IMasterRepository masterRepository, IClientRepository clientRepository, IQuerySession querySession)
    {
        public async Task<GetUserResponse> Handle(GetUserRequest request, CancellationToken cancellationToken)
        {
            var userAccount = await querySession.LoadAsync<UserAccount>(request.UserId, cancellationToken)
                ?? throw new NotFoundException($"User with ID {request.UserId} not found");

            if (userAccount.Role == UserRole.Admin)
            {
                return new GetUserResponse(
                    Id: userAccount.Id,
                    Role: UserRole.Admin,
                    Email: userAccount.Email,
                    FullName: userAccount.FullName
                );
            }

            if (userAccount.Role == UserRole.Client)
            {
                var client = await clientRepository.GetByUserIdAsync(request.UserId, cancellationToken)
                    ?? throw new NotFoundException($"Client profile for user {request.UserId} not found");

                return new GetUserResponse(
                    Id: client.Id,
                    Role: UserRole.Client,
                    Email: client.Email,
                    FullName: $"{client.FirstName} {client.LastName}".Trim()
                );
            }

            if (userAccount.Role == UserRole.Master)
            {
                var master = await masterRepository.GetByUserIdAsync(request.UserId, cancellationToken)
                    ?? throw new NotFoundException($"Master profile for user {request.UserId} not found");

                return new GetUserResponse(
                    Id: master.Id,
                    Role: UserRole.Master,
                    Email: master.Email,
                    FullName: $"{master.FirstName} {master.LastName}".Trim()
                );
            }

            throw new NotFoundException($"User with ID {request.UserId} is not registered in the system");
        }
    }
}
