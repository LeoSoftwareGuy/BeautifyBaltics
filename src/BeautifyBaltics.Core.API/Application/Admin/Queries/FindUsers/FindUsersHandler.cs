using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.AdminUserStatistics;
using BeautifyBaltics.Persistence.Repositories.User.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.FindUsers;

public class FindUsersHandler(IAdminUserStatisticsRepository adminUserStatisticsRepository)
{
    public async Task<PagedResponse<FindUsersResponse>> Handle(FindUsersRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<UserSearchDTO>();
        var result = await adminUserStatisticsRepository.GetPagedListAsync(search, cancellationToken);
        return result.ToPagedResponse<AdminUserStatistics, FindUsersResponse>();
    }
}
