using BeautifyBaltics.Core.API.Application.Users.Queries.UserProfile;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Client;
using BeautifyBaltics.Persistence.Repositories.Master;

namespace BeautifyBaltics.Core.API.Application.Users.Queries.GetUser
{
    public class GetUserHandler(IMasterRepository masterRepository, IClientRepository clientRepository)
    {
        public async Task<GetUserResponse> Handle(GetUserRequest request, CancellationToken cancellationToken)
        {
            var client = await clientRepository.GetBySupabaseUserIdAsync(request.UserId, cancellationToken);
            if (client is not null)
            {
                return new GetUserResponse(
                    Id: client.Id,
                    Role: UserRole.Client,
                    Email: client.Email,
                    FullName: $"{client.FirstName} {client.LastName}".Trim()
                );
            }

            var master = await masterRepository.GetBySupabaseUserIdAsync(request.UserId, cancellationToken);
            if (master is not null)
            {
                return new GetUserResponse(
                    Id: master.Id,
                    Role: UserRole.Master,
                    Email: master.Email,
                    FullName: $"{master.FirstName} {master.LastName}".Trim()
                );
            }

            throw new NotFoundException($"User with ID : {request.UserId} is not registered in the system");
        }
    }
}
