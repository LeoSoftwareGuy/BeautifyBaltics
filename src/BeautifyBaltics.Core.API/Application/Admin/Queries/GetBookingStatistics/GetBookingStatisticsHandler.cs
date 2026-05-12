using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetBookingStatistics;

public class GetBookingStatisticsHandler(IBookingRepository bookingRepository)
{
    public async Task<GetBookingStatisticsResponse> Handle(GetBookingStatisticsRequest request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var totalTask = bookingRepository.CountAsync(new BookingSearchDTO(), cancellationToken);
        var confirmedTask = bookingRepository.CountAsync(new BookingSearchDTO { Status = BookingStatus.Confirmed }, cancellationToken);
        var pendingTask = bookingRepository.CountAsync(new BookingSearchDTO { Status = BookingStatus.Requested }, cancellationToken);

        await Task.WhenAll(totalTask, confirmedTask, pendingTask);

        var bookingsThisMonth = await bookingRepository.GetListAsync(new BookingSearchDTO { ScheduledDateRange = [DateOnly.FromDateTime(monthStart), null] }, cancellationToken);
        var revenueThisMonth = bookingsThisMonth
            .Where(b => b.Status != BookingStatus.Cancelled)
            .Sum(b => b.Price);

        return new GetBookingStatisticsResponse
        {
            TotalBookings = await totalTask,
            Confirmed = await confirmedTask,
            Pending = await pendingTask,
            RevenueThisMonth = Math.Round(revenueThisMonth, 2),
        };
    }
}
