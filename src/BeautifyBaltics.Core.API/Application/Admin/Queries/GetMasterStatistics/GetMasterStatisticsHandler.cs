using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using BeautifyBaltics.Persistence.Repositories.Master;
using BeautifyBaltics.Persistence.Repositories.Master.DTOs;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetMasterStatistics;

public class GetMasterStatisticsHandler(IMasterRepository masterRepository, IBookingRepository bookingRepository)
{
    public async Task<GetMasterStatisticsResponse> Handle(GetMasterStatisticsRequest request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var thirtyDaysAgo = now.AddDays(-30);

        var totalMasters = await masterRepository.CountAsync(new MasterSearchDTO { All = true }, cancellationToken);
        var newMastersThisMonth = (await masterRepository.GetListByAsync(m => m.CreatedAt >= monthStart, cancellationToken)).Count;

        var recentBookings = await bookingRepository.GetListAsync(new BookingSearchDTO
        {
            From = thirtyDaysAgo,
        }, cancellationToken);

        var activeMasters = recentBookings
            .Where(b => b.Status != BookingStatus.Cancelled)
            .Select(b => b.MasterId)
            .Distinct()
            .Count();

        var pendingRequests = await bookingRepository.CountAsync(new BookingSearchDTO
        {
            Status = BookingStatus.Requested,
        }, cancellationToken);

        var bookingsLast30Days = recentBookings.Count(b => b.Status != BookingStatus.Cancelled);

        return new GetMasterStatisticsResponse
        {
            TotalMasters = totalMasters,
            NewMastersThisMonth = newMastersThisMonth,
            ActiveMastersLast30Days = activeMasters,
            PendingRequests = pendingRequests,
            TotalBookingsLast30Days = bookingsLast30Days,
        };
    }
}
