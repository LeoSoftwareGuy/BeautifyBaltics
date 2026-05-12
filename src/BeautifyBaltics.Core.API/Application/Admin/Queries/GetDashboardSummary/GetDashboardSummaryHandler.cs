using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using BeautifyBaltics.Persistence.Repositories.User;
using BeautifyBaltics.Persistence.Repositories.User.DTOs;
using BookingProjection = BeautifyBaltics.Persistence.Projections.Booking;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetDashboardSummary;

public class GetDashboardSummaryHandler(IUserRepository userRepository, IBookingRepository bookingRepository)
{
    public async Task<GetDashboardSummaryResponse> Handle(GetDashboardSummaryRequest request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var twelveMonthsAgo = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(-11);

        var totalBookingsTask = bookingRepository.CountAsync(new BookingSearchDTO(), cancellationToken);
        var mastersTask = userRepository.CountAsync(new UserSearchDTO { Role = UserRole.Master }, cancellationToken);
        var clientsTask = userRepository.CountAsync(new UserSearchDTO { Role = UserRole.Client }, cancellationToken);
        var bookingsTask = bookingRepository.GetListAsync(new BookingSearchDTO { ScheduledDateRange = [DateOnly.FromDateTime(twelveMonthsAgo), null] }, cancellationToken);

        await Task.WhenAll(totalBookingsTask, mastersTask, clientsTask, bookingsTask);

        var bookings = await bookingsTask;
        var monthlyPerformance = BuildMonthlyPerformance(bookings, twelveMonthsAgo, now);

        var recentActivities = bookings
            .OrderByDescending(b => b.RequestedAt)
            .Take(5)
            .Select(b => new DashboardRecentActivity(
                b.ClientName, b.MasterJobTitle, b.MasterName,
                decimal.Round(b.Price, 2), b.Status.ToString(), b.RequestedAt))
            .ToList();

        var billable = bookings.Where(b => b.Status != BookingStatus.Cancelled).ToList();
        var totalRevenue = billable.Sum(b => b.Price);
        var serviceCategories = BuildServiceCategories(billable, totalRevenue);

        return new GetDashboardSummaryResponse
        {
            TotalClients = await clientsTask,
            TotalMasters = await mastersTask,
            TotalBookings = await totalBookingsTask,
            TotalRevenue = decimal.Round(totalRevenue, 2),
            MonthlyPerformance = monthlyPerformance,
            RecentActivities = recentActivities,
            ServiceCategories = serviceCategories,
        };
    }

    private static IReadOnlyList<MonthlyBookingStat> BuildMonthlyPerformance(
        IReadOnlyList<BookingProjection> bookings, DateTime from, DateTime now
    )
    {
        var result = new List<MonthlyBookingStat>();
        var cursor = new DateTime(from.Year, from.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        while (cursor <= now)
        {
            var next = cursor.AddMonths(1);
            var month = bookings.Where(b => b.ScheduledAt >= cursor && b.ScheduledAt < next).ToList();

            result.Add(new MonthlyBookingStat(
                cursor.Year, cursor.Month,
                month.Count(b => b.Status == BookingStatus.Completed),
                month.Count(b => b.Status == BookingStatus.Confirmed),
                month.Count(b => b.Status == BookingStatus.Cancelled)));

            cursor = next;
        }

        return result;
    }

    private static IReadOnlyList<ServiceCategoryRevenueStat> BuildServiceCategories(IReadOnlyList<BookingProjection> billable, decimal totalRevenue)
    {
        if (totalRevenue == 0) return [];

        return billable
            .GroupBy(b => b.MasterJobCategoryName)
            .Select(g =>
            {
                var revenue = g.Sum(b => b.Price);
                var percentage = (int)decimal.Round(revenue / totalRevenue * 100, 0);
                return new ServiceCategoryRevenueStat(g.Key, decimal.Round(revenue, 2), percentage);
            })
            .OrderByDescending(x => x.Revenue)
            .ToList();
    }
}
