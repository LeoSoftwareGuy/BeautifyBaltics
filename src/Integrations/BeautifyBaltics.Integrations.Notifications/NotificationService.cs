using BeautifyBaltics.Integrations.Notifications.Email;
using BeautifyBaltics.Integrations.Notifications.Options;
using BeautifyBaltics.Integrations.Notifications.Sms;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BeautifyBaltics.Integrations.Notifications;

public class NotificationService(
    ISmsService smsService,
    IEmailService emailService,
    IOptions<EmailOptions> emailOptions,
    ILogger<NotificationService> logger
) : INotificationService
{
    private readonly EmailTemplates _templates = emailOptions.Value.Templates;

    public async Task NotifyBookingConfirmedAsync(BookingNotificationContext context, CancellationToken cancellationToken = default)
    {
        logger.LogInformation(
            "Sending booking confirmation notifications for {ServiceName} scheduled at {ScheduledAt}",
            context.ServiceName,
            context.ScheduledAt
        );

        var tasks = new List<Task>
        {
            SendClientConfirmationSmsAsync(context),
            SendMasterConfirmationSmsAsync(context),
            SendClientConfirmationEmailAsync(context, cancellationToken),
            SendMasterConfirmationEmailAsync(context, cancellationToken)
        };

        await Task.WhenAll(tasks);
    }

    public async Task NotifyBookingCancelledAsync(BookingNotificationContext context, CancellationToken cancellationToken = default)
    {
        logger.LogInformation(
            "Sending booking cancellation notifications for {ServiceName} scheduled at {ScheduledAt}",
            context.ServiceName,
            context.ScheduledAt
        );

        var tasks = new List<Task>
        {
            SendClientCancellationSmsAsync(context),
            SendMasterCancellationSmsAsync(context),
            SendClientCancellationEmailAsync(context, cancellationToken),
            SendMasterCancellationEmailAsync(context, cancellationToken)
        };

        await Task.WhenAll(tasks);
    }

    private Task SendClientConfirmationSmsAsync(BookingNotificationContext context)
    {
        var message = $"Tere, {context.ClientName}! Teie broneering on kinnitatud: {context.ServiceName} {context.ScheduledAt:dd.MM.yyyy HH:mm}. Meister: {context.MasterName}. Aitäh!";
        return smsService.SendSmsAsync(context.ClientPhone, message);
    }

    private Task SendMasterConfirmationSmsAsync(BookingNotificationContext context)
    {
        var message = $"Uus kinnitus! {context.ClientName} broneeris {context.ServiceName} {context.ScheduledAt:dd.MM.yyyy HH:mm}. Hind: {context.Price}€";
        return smsService.SendSmsAsync(context.MasterPhone, message);
    }

    private Task SendClientCancellationSmsAsync(BookingNotificationContext context)
    {
        var message = $"Teie broneering {context.ServiceName} {context.ScheduledAt:dd.MM.yyyy} on tühistatud. Vabandame ebamugavuste pärast.";
        return smsService.SendSmsAsync(context.ClientPhone, message);
    }

    private Task SendMasterCancellationSmsAsync(BookingNotificationContext context)
    {
        var message = $"Broneering tühistatud: {context.ClientName}, {context.ServiceName} {context.ScheduledAt:dd.MM.yyyy HH:mm}";
        return smsService.SendSmsAsync(context.MasterPhone, message);
    }

    private Task SendClientConfirmationEmailAsync(BookingNotificationContext context, CancellationToken cancellationToken)
    {
        var templateData = new
        {
            booking_id = context.BookingId.ToString(),
            client_name = context.ClientName,
            client_phone = context.ClientPhone,
            service_name = context.ServiceName,
            booking_date = $"{context.ScheduledAt:dd.MM.yyyy HH:mm}",
            duration = context.Duration.TotalMinutes,
            price = context.Price,
            master_name = context.MasterName,
            location_name = context.LocationName ?? string.Empty,
            location_address = context.LocationAddress ?? string.Empty
        };

        return emailService.SendWithTemplateAsync(
            context.ClientEmail,
            _templates.ClientBookingConfirmed,
            templateData,
            cancellationToken
        );
    }

    private Task SendMasterConfirmationEmailAsync(BookingNotificationContext context, CancellationToken cancellationToken)
    {
        var templateData = new
        {
            booking_id = context.BookingId.ToString(),
            master_name = context.MasterName,
            client_name = context.ClientName,
            client_phone = context.ClientPhone,
            client_email = context.ClientEmail,
            service_name = context.ServiceName,
            booking_date = $"{context.ScheduledAt:dd.MM.yyyy HH:mm}",
            duration = context.Duration.TotalMinutes,
            price = context.Price,
            location_name = context.LocationName ?? string.Empty,
            location_address = context.LocationAddress ?? string.Empty
        };

        return emailService.SendWithTemplateAsync(
            context.MasterEmail,
            _templates.MasterBookingConfirmed,
            templateData,
            cancellationToken
        );
    }

    private Task SendClientCancellationEmailAsync(BookingNotificationContext context, CancellationToken cancellationToken)
    {
        var templateData = new
        {
            booking_id = context.BookingId.ToString(),
            client_name = context.ClientName,
            service_name = context.ServiceName,
            booking_date = $"{context.ScheduledAt:dd.MM.yyyy HH:mm}",
            master_name = context.MasterName,
            location_name = context.LocationName ?? string.Empty,
            location_address = context.LocationAddress ?? string.Empty
        };

        return emailService.SendWithTemplateAsync(
            context.ClientEmail,
            _templates.ClientBookingCancelled,
            templateData,
            cancellationToken
        );
    }

    private Task SendMasterCancellationEmailAsync(BookingNotificationContext context, CancellationToken cancellationToken)
    {
        var templateData = new
        {
            booking_id = context.BookingId.ToString(),
            master_name = context.MasterName,
            client_name = context.ClientName,
            service_name = context.ServiceName,
            booking_date = $"{context.ScheduledAt:dd.MM.yyyy HH:mm}",
            location_name = context.LocationName ?? string.Empty,
            location_address = context.LocationAddress ?? string.Empty
        };

        return emailService.SendWithTemplateAsync(
            context.MasterEmail,
            _templates.MasterBookingCancelled,
            templateData,
            cancellationToken
        );
    }
}
