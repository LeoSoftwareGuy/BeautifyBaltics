using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Domain.Documents.User;
using BeautifyBaltics.Persistence.Repositories.User;
using BeautifyBaltics.Persistence.Repositories.User.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.FindUsers;

public class FindUsersHandler(IUserRepository userRepository)
{
    public async Task<PagedResponse<FindUsersResponse>> Handle(FindUsersRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<UserSearchDTO>();
        var result = await userRepository.GetPagedListAsync(search, cancellationToken);
        return result.ToPagedResponse<User, FindUsersResponse>();
    }
}
