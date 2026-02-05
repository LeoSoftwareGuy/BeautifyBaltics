using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Enumerations;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Booking.BackgroundServices;

public class BookingExpirationBackgroundService(
    IServiceScopeFactory serviceScopeFactory,
    ILogger<BookingExpirationBackgroundService> logger
) : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
    private readonly ILogger<BookingExpirationBackgroundService> _logger = logger;
    private readonly TimeSpan _pollInterval = TimeSpan.FromMinutes(15);
    private readonly TimeSpan _requestExpirationWindow = TimeSpan.FromHours(3);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("BookingExpirationBackgroundService is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CancelExpiredRequestsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while cancelling expired booking requests.");
            }

            await Task.Delay(_pollInterval, stoppingToken);
        }
    }

    private async Task CancelExpiredRequestsAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var session = scope.ServiceProvider.GetRequiredService<IDocumentSession>();

        var now = DateTime.UtcNow;
        var expirationCutoff = DateTime.SpecifyKind(now - _requestExpirationWindow, DateTimeKind.Unspecified);

        var expiredRequests = await session.Query<Persistence.Projections.Booking>()
            .Where(b => b.Status == BookingStatus.Requested)
            .Where(b => b.RequestedAt < expirationCutoff)
            .ToListAsync(stoppingToken);

        if (expiredRequests.Count == 0)
        {
            _logger.LogDebug("No booking requests to auto-cancel at this time.");
            return;
        }

        foreach (var booking in expiredRequests)
        {
            var bookingCancelledEvent = new BookingCancelled(
                BookingId: booking.Id,
                MasterId: booking.MasterId
            );

            session.Events.Append(booking.Id, bookingCancelledEvent);

            _logger.LogInformation(
                "Auto-cancelled booking {BookingId} after exceeding the confirmation window.",
                booking.Id
            );
        }

        await session.SaveChangesAsync(stoppingToken);

        _logger.LogInformation("Auto-cancelled {Count} expired booking requests.", expiredRequests.Count);
    }
}
