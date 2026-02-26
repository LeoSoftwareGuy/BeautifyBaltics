using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using BeautifyBaltics.Persistence.Repositories.Client;
using BeautifyBaltics.Persistence.Repositories.Client.DTOs;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetClientStatistics;

public class GetClientStatisticsHandler(IClientRepository clientRepository, IBookingRepository bookingRepository)
{
    public async Task<GetClientStatisticsResponse> Handle(GetClientStatisticsRequest request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var thirtyDaysAgo = now.AddDays(-30);

        var totalClients = await clientRepository.CountAsync(new ClientSearchDTO { All = true }, cancellationToken);
        var newClientsThisMonth = (await clientRepository.GetListByAsync(c => c.CreatedAt >= monthStart, cancellationToken)).Count;

        var bookingsLast30Days = await bookingRepository.GetListAsync(new BookingSearchDTO
        {
            From = thirtyDaysAgo,
        }, cancellationToken);

        var activeClients = bookingsLast30Days
            .Where(b => b.Status != BookingStatus.Cancelled)
            .Select(b => b.ClientId)
            .Distinct()
            .Count();

        var totalBookingsLast30Days = bookingsLast30Days.Count(b => b.Status != BookingStatus.Cancelled);

        var completedBookings = await bookingRepository.GetListAsync(new BookingSearchDTO
        {
            Status = BookingStatus.Completed,
        }, cancellationToken);

        var totalCompletedValue = completedBookings.Sum(b => b.Price);

        return new GetClientStatisticsResponse
        {
            TotalClients = totalClients,
            NewClientsThisMonth = newClientsThisMonth,
            ActiveClientsLast30Days = activeClients,
            TotalBookingsLast30Days = totalBookingsLast30Days,
            TotalCompletedBookingValue = Math.Round(totalCompletedValue, 2),
        };
    }
}
