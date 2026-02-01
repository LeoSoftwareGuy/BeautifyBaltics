using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.Booking;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetDashboardStats;

public class GetDashboardStatsHandler(IBookingRepository bookingRepository)
{
    public async Task<GetDashboardStatsResponse> Handle(GetDashboardStatsRequest request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var currentMonthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Unspecified);
        var previousMonthStart = currentMonthStart.AddMonths(-1);
        var previousMonthEnd = currentMonthStart.AddTicks(-1);
        var twelveMonthsAgo = currentMonthStart.AddMonths(-12);

        // Get all non-cancelled bookings for total count
        var allBookings = await bookingRepository.GetListAsync(new BookingSearchDTO { MasterId = request.MasterId }, cancellationToken);

        var nonCancelledBookings = allBookings
            .Where(b => b.Status != BookingStatus.Cancelled)
            .ToList();

        var totalBookings = nonCancelledBookings.Count;

        // Current month bookings count
        var currentMonthBookings = nonCancelledBookings.Count(b => b.ScheduledAt >= currentMonthStart);

        // Previous month bookings count
        var previousMonthBookings = nonCancelledBookings.Count(b => b.ScheduledAt >= previousMonthStart && b.ScheduledAt < currentMonthStart);

        var totalBookingsChange = CalculatePercentageChange(previousMonthBookings, currentMonthBookings);

        // Get completed bookings for earnings
        var completedBookings = await bookingRepository.GetListAsync(
            new BookingSearchDTO { MasterId = request.MasterId, Status = BookingStatus.Completed },
            cancellationToken
        );

        // Current month earnings
        var currentMonthEarnings = completedBookings
            .Where(b => b.ScheduledAt >= currentMonthStart)
            .Sum(b => b.Price);

        // Previous month earnings
        var previousMonthEarnings = completedBookings
            .Where(b => b.ScheduledAt >= previousMonthStart && b.ScheduledAt < currentMonthStart)
            .Sum(b => b.Price);

        // Monthly earnings average: total earnings over last 12 months / 12
        var last12MonthsEarnings = completedBookings
            .Where(b => b.ScheduledAt >= twelveMonthsAgo)
            .Sum(b => b.Price);
        var monthlyEarningsAverage = last12MonthsEarnings / 12;

        var monthlyEarningsChange = CalculatePercentageChange(previousMonthEarnings, currentMonthEarnings);

        var pendingRequestsCount = await bookingRepository.CountAsync(
            new BookingSearchDTO { MasterId = request.MasterId, Status = BookingStatus.Requested },
            cancellationToken
        );

        return new GetDashboardStatsResponse
        {
            TotalBookings = totalBookings,
            TotalBookingsChange = Math.Round(totalBookingsChange, 1),
            MonthlyEarningsAverage = Math.Round(monthlyEarningsAverage, 2),
            MonthlyEarningsChange = Math.Round(monthlyEarningsChange, 1),
            PendingRequestsCount = pendingRequestsCount
        };
    }

    private static decimal CalculatePercentageChange(decimal previousValue, decimal currentValue)
    {
        if (previousValue == 0) return currentValue > 0 ? 100m : 0m;
        return ((currentValue - previousValue) / previousValue) * 100;
    }
}
