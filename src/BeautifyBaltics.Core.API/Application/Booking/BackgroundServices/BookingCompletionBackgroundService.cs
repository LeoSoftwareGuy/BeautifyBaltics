using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Enumerations;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.BackgroundServices;

public class BookingCompletionBackgroundService(
    IServiceScopeFactory serviceScopeFactory,
    ILogger<BookingCompletionBackgroundService> logger
) : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
    private readonly ILogger<BookingCompletionBackgroundService> _logger = logger;
    private readonly TimeSpan _interval = TimeSpan.FromHours(6);
    private readonly TimeSpan _completionThreshold = TimeSpan.FromHours(3);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("BookingCompletionBackgroundService is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingCompletionsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing booking completions.");
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }

    private async Task ProcessPendingCompletionsAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var session = scope.ServiceProvider.GetRequiredService<IDocumentSession>();

        var now = DateTime.UtcNow;
        var completionCutoff = DateTime.SpecifyKind(now - _completionThreshold, DateTimeKind.Unspecified);

        var bookingsToComplete = await session.Query<Persistence.Projections.Booking>()
            .Where(b => b.Status == BookingStatus.Confirmed)
            .Where(b => b.ScheduledAt < completionCutoff)
            .ToListAsync(stoppingToken);

        if (bookingsToComplete.Count == 0)
        {
            _logger.LogDebug("No bookings to complete at this time.");
            return;
        }

        _logger.LogInformation("Found {Count} bookings to auto-complete.", bookingsToComplete.Count);

        var completedAt = now;
        var nowUnspecified = DateTime.SpecifyKind(now, DateTimeKind.Unspecified);

        foreach (var booking in bookingsToComplete)
        {
            var bookingEndTime = booking.ScheduledAt + booking.Duration;

            if (bookingEndTime.Add(_completionThreshold) > nowUnspecified) continue;

            var completedEvent = new BookingCompleted(
                BookingId: booking.Id,
                CompletedAt: completedAt
            );

            session.Events.Append(booking.Id, completedEvent);

            _logger.LogInformation("Marked booking {BookingId} as completed.", booking.Id);
        }

        await session.SaveChangesAsync(stoppingToken);

        _logger.LogInformation("Successfully completed {Count} bookings.", bookingsToComplete.Count);
    }
}
