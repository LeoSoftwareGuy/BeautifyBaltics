using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using BeautifyBaltics.Persistence.Repositories.User;
using BeautifyBaltics.Persistence.Repositories.User.DTOs;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetUserStatistics;

public class GetUserStatisticsHandler(IUserRepository userRepository, IBookingRepository bookingRepository)
{
    public async Task<GetUserStatisticsResponse> Handle(GetUserStatisticsRequest request, CancellationToken cancellationToken)
    {
        var totalTask = userRepository.CountAsync(new UserSearchDTO(), cancellationToken);
        var mastersTask = userRepository.CountAsync(new UserSearchDTO { Role = UserRole.Master }, cancellationToken);
        var clientsTask = userRepository.CountAsync(new UserSearchDTO { Role = UserRole.Client }, cancellationToken);

        await Task.WhenAll(totalTask, mastersTask, clientsTask);

        var completedBookings = await bookingRepository.GetListAsync(
            new BookingSearchDTO { Status = BookingStatus.Completed }, cancellationToken);
        var platformVolume = completedBookings.Sum(b => b.Price);

        return new GetUserStatisticsResponse
        {
            TotalUsers = await totalTask,
            TotalMasters = await mastersTask,
            TotalClients = await clientsTask,
            PlatformVolume = Math.Round(platformVolume, 2),
        };
    }
}
