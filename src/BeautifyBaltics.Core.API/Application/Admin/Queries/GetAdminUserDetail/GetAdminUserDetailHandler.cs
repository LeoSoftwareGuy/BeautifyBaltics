using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.AdminUserStatistics;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using BeautifyBaltics.Persistence.Repositories.Master;
using BeautifyBaltics.Persistence.Projections;
using Marten;
using MasterJobProjection = BeautifyBaltics.Persistence.Projections.MasterJob;

namespace BeautifyBaltics.Core.API.Application.Admin.Queries.GetAdminUserDetail;

public class GetAdminUserDetailHandler(
    IAdminUserStatisticsRepository adminUserStatisticsRepository,
    IMasterRepository masterRepository,
    IBookingRepository bookingRepository,
    IQuerySession querySession)
{
    public async Task<GetAdminUserDetailResponse> Handle(GetAdminUserDetailRequest request, CancellationToken cancellationToken)
    {
        var stats = await adminUserStatisticsRepository.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw NotFoundException.For<AdminUserStatistics>(request.UserId);

        var since = DateTimeOffset.UtcNow.AddMonths(-6);
        var isMaster = stats.Role == UserRole.Master;
        Persistence.Projections.Booking[] bookings = [];
        Persistence.Projections.Master? master = null;

        if (isMaster && stats.MasterId is not null)
        {
            master = await masterRepository.GetByUserIdAsync(stats.Id, cancellationToken);
            if (stats.MasterId is Guid masterAggregateId)
            {
                var result = await bookingRepository.GetListAsync(
                    new BookingSearchDTO { MasterIds = [masterAggregateId], From = since.UtcDateTime, All = true },
                    cancellationToken);
                bookings = [.. result];
            }
        }
        else if (stats.ClientId is Guid clientAggregateId)
        {
            var result = await bookingRepository.GetListAsync(
                new BookingSearchDTO { ClientIds = [clientAggregateId], From = since.UtcDateTime, All = true },
                cancellationToken);
            bookings = [.. result];
        }

        IReadOnlyList<string> services = [];
        IReadOnlyList<string> categories = [];

        if (master != null)
        {
            var masterJobs = await querySession.Query<MasterJobProjection>()
                .Where(j => j.MasterId == master.Id)
                .ToListAsync(cancellationToken);

            services = masterJobs.Select(j => j.Title).Distinct().OrderBy(s => s).ToList();
            categories = masterJobs.Select(j => j.JobCategoryName).Distinct().OrderBy(c => c).ToList();
        }

        return new GetAdminUserDetailResponse
        {
            Id = stats.Id,
            FullName = stats.FullName,
            Email = stats.Email,
            Role = stats.Role,
            MasterProfileId = master?.Id ?? stats.MasterId,
            City = master?.City,
            Description = master?.Description,
            Rating = master?.Rating ?? stats.Rating,
            Services = services,
            Categories = categories,
            BookingHistory = BuildBookingHistory(bookings),
        };
    }

    private static IReadOnlyList<UserBookingHistoryEntry> BuildBookingHistory(IReadOnlyList<BeautifyBaltics.Persistence.Projections.Booking> bookings)
    {
        var now = DateTimeOffset.UtcNow;
        var result = new List<UserBookingHistoryEntry>();

        for (var i = 5; i >= 0; i--)
        {
            var month = now.AddMonths(-i);
            var monthBookings = bookings
                .Where(b => b.ScheduledAt.Year == month.Year && b.ScheduledAt.Month == month.Month)
                .ToList();
            var earnings = monthBookings.Where(b => b.Status == BookingStatus.Completed).Sum(b => b.Price);
            result.Add(new UserBookingHistoryEntry(month.Year, month.Month, monthBookings.Count, earnings));
        }

        return result;
    }
}
