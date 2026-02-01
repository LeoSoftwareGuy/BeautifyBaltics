using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.Booking;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetEarningsPerformance;

public class GetEarningsPerformanceHandler(IBookingRepository bookingRepository)
{
    private static readonly string[] DayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    private static readonly string[] MonthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    public async Task<GetEarningsPerformanceResponse> Handle(GetEarningsPerformanceRequest request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;

        var (startDate, dataPoints) = request.Period switch
        {
            EarningsPeriod.Weekly => GetWeeklyData(now),
            EarningsPeriod.Monthly => GetMonthlyData(now),
            EarningsPeriod.Yearly => GetYearlyData(now),
            _ => GetMonthlyData(now)
        };

        var search = new BookingSearchDTO
        {
            MasterId = request.MasterId,
            Status = BookingStatus.Completed,
            From = startDate
        };

        var completedBookings = await bookingRepository.GetListAsync(search, cancellationToken);

        var data = request.Period switch
        {
            EarningsPeriod.Weekly => AggregateWeekly(completedBookings, dataPoints, now),
            EarningsPeriod.Monthly => AggregateMonthly(completedBookings, dataPoints, now),
            EarningsPeriod.Yearly => AggregateYearly(completedBookings, dataPoints, now),
            _ => AggregateMonthly(completedBookings, dataPoints, now)
        };

        return new GetEarningsPerformanceResponse
        {
            Period = request.Period,
            Data = data,
            Total = data.Sum(d => d.Value)
        };
    }

    private static (DateTime startDate, List<EarningsDataPoint> dataPoints) GetWeeklyData(DateTime now)
    {
        // Last 7 days
        var startDate = now.Date.AddDays(-6);
        var dataPoints = new List<EarningsDataPoint>();

        for (int i = 0; i < 7; i++)
        {
            var date = startDate.AddDays(i);
            var dayOfWeek = (int)date.DayOfWeek;
            // Convert Sunday (0) to 6, Monday (1) to 0, etc.
            var labelIndex = dayOfWeek == 0 ? 6 : dayOfWeek - 1;
            dataPoints.Add(new EarningsDataPoint { Label = DayLabels[labelIndex], Value = 0 });
        }

        return (DateTime.SpecifyKind(startDate, DateTimeKind.Unspecified), dataPoints);
    }

    private static (DateTime startDate, List<EarningsDataPoint> dataPoints) GetMonthlyData(DateTime now)
    {
        // Last 12 months
        var startDate = new DateTime(now.Year, now.Month, 1).AddMonths(-11);
        var dataPoints = new List<EarningsDataPoint>();

        for (int i = 0; i < 12; i++)
        {
            var date = startDate.AddMonths(i);
            dataPoints.Add(new EarningsDataPoint { Label = MonthLabels[date.Month - 1], Value = 0 });
        }

        return (DateTime.SpecifyKind(startDate, DateTimeKind.Unspecified), dataPoints);
    }

    private static (DateTime startDate, List<EarningsDataPoint> dataPoints) GetYearlyData(DateTime now)
    {
        // Last 5 years
        var startYear = now.Year - 4;
        var startDate = new DateTime(startYear, 1, 1);
        var dataPoints = new List<EarningsDataPoint>();

        for (int i = 0; i < 5; i++)
        {
            dataPoints.Add(new EarningsDataPoint { Label = (startYear + i).ToString(), Value = 0 });
        }

        return (DateTime.SpecifyKind(startDate, DateTimeKind.Unspecified), dataPoints);
    }

    private static List<EarningsDataPoint> AggregateWeekly(
        IReadOnlyList<Persistence.Projections.Booking> bookings,
        List<EarningsDataPoint> dataPoints,
        DateTime now
    )
    {
        var startDate = now.Date.AddDays(-6);

        for (int i = 0; i < 7; i++)
        {
            var dayStart = startDate.AddDays(i);
            var dayEnd = dayStart.AddDays(1);

            var dayEarnings = bookings
                .Where(b => b.ScheduledAt >= dayStart && b.ScheduledAt < dayEnd)
                .Sum(b => b.Price);

            dataPoints[i] = dataPoints[i] with { Value = dayEarnings };
        }

        return dataPoints;
    }

    private static List<EarningsDataPoint> AggregateMonthly(
        IReadOnlyList<Persistence.Projections.Booking> bookings,
        List<EarningsDataPoint> dataPoints,
        DateTime now
    )
    {
        var startDate = new DateTime(now.Year, now.Month, 1).AddMonths(-11);

        for (int i = 0; i < 12; i++)
        {
            var monthStart = startDate.AddMonths(i);
            var monthEnd = monthStart.AddMonths(1);

            var monthEarnings = bookings
                .Where(b => b.ScheduledAt >= monthStart && b.ScheduledAt < monthEnd)
                .Sum(b => b.Price);

            dataPoints[i] = dataPoints[i] with { Value = monthEarnings };
        }

        return dataPoints;
    }

    private static List<EarningsDataPoint> AggregateYearly(
        IReadOnlyList<Persistence.Projections.Booking> bookings,
        List<EarningsDataPoint> dataPoints,
        DateTime now
    )
    {
        var startYear = now.Year - 4;

        for (int i = 0; i < 5; i++)
        {
            var year = startYear + i;
            var yearStart = new DateTime(year, 1, 1);
            var yearEnd = new DateTime(year + 1, 1, 1);

            var yearEarnings = bookings
                .Where(b => b.ScheduledAt >= yearStart && b.ScheduledAt < yearEnd)
                .Sum(b => b.Price);

            dataPoints[i] = dataPoints[i] with { Value = yearEarnings };
        }

        return dataPoints;
    }
}
