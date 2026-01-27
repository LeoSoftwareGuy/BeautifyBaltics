namespace BeautifyBaltics.Integrations.Notifications;

public interface INotificationService
{
    Task NotifyBookingRequestedAsync(BookingNotificationContext context, CancellationToken cancellationToken = default);
    Task NotifyBookingConfirmedAsync(BookingNotificationContext context, CancellationToken cancellationToken = default);
    Task NotifyBookingCancelledAsync(BookingNotificationContext context, CancellationToken cancellationToken = default);
}

public record BookingNotificationContext(
    Guid BookingId,
    string ClientName,
    string ClientEmail,
    string ClientPhone,
    string MasterName,
    string MasterEmail,
    string MasterPhone,
    string ServiceName,
    DateTime ScheduledAt,
    TimeSpan Duration,
    decimal Price,
    string? LocationName = null,
    string? LocationAddress = null
);
